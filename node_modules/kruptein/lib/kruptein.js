/*!
 * kruptein
 * Copyright(c) 2019 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */
"use strict";

class Kruptein {

  /**
   * Kruptein class constructor; sets private / public defaults
   * @param {object} options User supplied key / value object
   */
  constructor(options) {
    options = options || {};

    this.crypto = require("crypto");

    // Set defaults if the user didn't supply any
    //   References: SP 800-38A, 800-38B
    this.algorithm = options.algorithm || "aes-256-gcm";
    this.hashing = options.hashing || "sha512";
    this.encodeas = options.encodeas || "binary";

    // Are we using AEAD mode (authenticated ciphers)?
    //   References: SP 800-38A, 800-38B
    this._aead_mode = this.algorithm.match(/ccm|gcm|ocb/) ? true : false;

    // Set some defaults based on the algorithm used
    //   References: SP 800-38A, 800-38B, 800-107, 800-131A
    let defaults = this._matrix(this.algorithm);
    this._at_size = options._at_size || defaults._at_size;
    this._iv_size = options._iv_size || defaults._iv_size;
    this._key_size = options._key_size || defaults._key_size;

    // Replace pbkdf2 with scrypt for key derivation?
    //   References: SP 800-108 & 800-132
    this._use_scrypt = options.use_scrypt || false;

    // Use asn.1 encoding?
    if (options.use_asn1) {
      this._use_asn1 = options.use_asn1;
      this.asn1 = require("asn1.js");
      this.schema = this._schema();
    }
  }


  /**
   * Public interface for creating ciphertext from plaintext
   * @param {string} secret User supplied key material
   * @param {string} plaintext User supplied plaintext
   * @param {string} aad (optional) User supplied additional authentication data
   * @param {function} cb User supplied callback function
   * @returns {object}
   */
  set(secret, plaintext, aad, cb) {
    // If non-aead cipher then expect 3 vs. 4 args
    cb = cb || aad;

    // Initialize some defaults
    let iv, ct, hmac, obj, key;

    // Bail if using weak cipher algorithm modes
    //   References: SP 800-38A, 800-38B, 800-131A & 800-175B
    if (this._validator())
      return cb("Insecure cipher mode not supported!");

    // Bail if secret is not provided
    if (!secret)
      return cb("Must supply a secret!");

    // Derive a stronger key from secret;
    //   References: SP 800-57P1, 800-108, 800-132 & 800-175B
    this._derive_key(secret, (err, secret) => {
      if (err)
        return cb("Unable to derive key!");

      key = secret;
    });

    // Generate a random IV based on the algorithms IV size
    //   References: RFC 4086, SP 800-57P1, 800-132 & 800-175B
    iv = this._iv(this._iv_size);

    // Are we dealing with an object?
    let pt = plaintext;
    try {
      plaintext = Buffer.from(JSON.stringify(pt));
    } catch(err) {
      plaintext = Buffer.from(pt);
    }

    // If AEAD mode cipher used and an AAD not provided, create one
    //   References: SP 800-38A, 800-38B, 800-131A & 800-175B
    if (this._aead_mode && typeof aad === "function") {
      this._digest(this._iv(128), plaintext, this.hashing, this.encodeas, (err, res) => {
        if (err)
          return cb("Unable to generate AAD!");

        aad = res;
      });
    }

    // Create ciphertext from plaintext with derived key
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    this._encrypt(key.key, plaintext, this.algorithm, this.encodeas, iv, aad, (err, ciphertext) => {
      if (err)
        return cb("Unable to create ciphertext!");

      ct = ciphertext;
    });

    // Create an HMAC from the resulting ciphertext
    //   References: FIPS 180-4, FIPS 198-1
    this._digest(key.key, ct.ct, this.hashing, this.encodeas, (err, digest) => {
      if (err)
        return cb("Unable to create digest!");

      hmac = digest;
    });

    // Create an object to pass back
    obj = {
      hmac: hmac,
      ct: ct.ct,
      iv: iv,
      salt: key.salt
    };

    // If AEAD mode include the AAD
    if (aad)
      obj.aad = aad;

    // If AEAD mode include the AT
    if (ct.at)
      obj.at = ct.at;


    // Make sure the retured object is encoded property
    return (this._use_asn1) ?
      cb(null, this.schema.encode(obj).toString(this.encodeas)) :
      cb(null, JSON.stringify(obj));
  }


  /**
   * Public interface for decrypting plaintext
   * @param {string} secret User supplied key material
   * @param {string} ciphertext User supplied ciphertext
   * @param {object} opts (optional) User supplied AEAD mode data
   * @param {function} cb User supplied callback function
   * @returns {object}
   */
  get(secret, ciphertext, opts, cb) {
    // If non-aead cipher then expect 3 vs. 4 args
    cb = cb || opts;

    // Initialize some defaults
    let ct, hmac, pt, key;

    // Bail if using weak cipher algorithm modes
    //   References: SP 800-38A, 800-38B, 800-131A & 800-175B
    if (this._validator())
      return cb("Insecure cipher mode not supported!");

    // Bail if secret is not provided
    if (!secret)
      return cb("Must supply a secret!");

    // Parse the provided ciphertext object or bail
    try {
      if (this._use_asn1) {
        ct = this.schema.decode(Buffer.from(ciphertext, this.encodeas));
        ct.ct = ct.ct.toString();
        if (ct.aad)
          ct.aad = ct.aad.toString();
      } else {
        ct = JSON.parse(ciphertext);
      }
    } catch (err) {
      return cb("Unable to parse ciphertext object!");
    }

    // Derive a stronger key from secret;
    //   References: SP 800-57P1, 800-108, 800-132 & 800-175B
    this._derive_key(secret, ct.salt, (err, secret) => {
      if (err)
        return cb("Unable to derive key!");

      key = secret;
    });

    // Create an HMAC from the ciphertext HMAC value
    //   References: FIPS 180-4, FIPS 198-1
    this._digest(key.key, ct.ct, this.hashing, this.encodeas, (err, res) => {
      if (err)
        cb("Unable to generate HMAC!");

      hmac = res;
    });


    // Compare computed from included & bail if not identical
    //   References: Oracle padding attack, side channel attacks & malleable
    if (hmac !== ct.hmac.toString())
      return cb("Encrypted session was tampered with!");

    // If provided get the AAD &/or AT values
    if (opts) {
      ct.aad = (opts.aad) ? opts.aad :
        (ct.aad) ? ct.aad : false;

      ct.at = (opts.at && !ct.at) ?
        opts.at : (ct.at) ?
        ct.at : false;
    }

    // Convert the AT to a buffer
    if (ct.at)
      ct.at = Buffer.from(ct.at, this.encodeas);

    // Create plaintext from ciphertext with derived key
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    this._decrypt(key.key, ct.ct, this.algorithm, this.encodeas, Buffer.from(ct.iv, this.encodeas), ct.at, ct.aad, (err, res) => {
      if (err)
        return cb("Unable to decrypt ciphertext!");

      pt = res;
    });

    return cb(null, pt);
  }


  /**
   * Private function to encrypt plaintext
   * @param {buffer} key Derived key material
   * @param {string} pt User supplied plaintext
   * @param {string} algo Cipher to encrypt with
   * @param {string} encodeas Encoding output format
   * @param {buffer} iv Unique IV
   * @param {string} aad (optional) AAD for AEAD mode ciphers
   * @param {function} cb User supplied callback function
   * @returns {object}
   */
  _encrypt(key, pt, algo, encodeas, iv, aad, cb) {
    // If non-aead cipher then expect 6 vs. 7 args
    cb = cb || aad;

    // Initialize some defaults
    let cipher, ct, at;

    // Create a new cipher object using algorithm, derived key & iv
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    cipher = this.crypto.createCipheriv(algo, key, iv, {
      authTagLength: this._at_size
    });

    // If an AEAD cipher is used & an AAD supplied, include it
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    if (this._aead_mode && typeof aad !== "function") {
      try {
        cipher.setAAD(Buffer.from(aad, encodeas), {
          plaintextLength: Buffer.byteLength(pt)
        });
      } catch (err) {
        return cb("Unable to set AAD!");
      }
    }

    // Add our plaintext; encode & pad the resulting cipher text
    ct = cipher.update(Buffer.from(pt, encodeas), "utf8", encodeas);
    cipher.setAutoPadding(true);
    ct += cipher.final(encodeas);

    // If an AEAD cipher is used, retrieve the authentication tag
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    if (this._aead_mode) {
      try {
        at = cipher.getAuthTag();
      } catch (err) {
        return cb("Unable to obtain authentication tag");
      }
    }

    // Return the object
    return cb(null, (at) ? { "ct": ct, "at": at } : { "ct": ct });
  }


  /**
   * Private function to decrypt ciphertext
   * @param {buffer} key Derived key material
   * @param {object} ct User supplied ciphertext object
   * @param {string} algo Cipher to encrypt with
   * @param {string} encodeas Encoding output format
   * @param {buffer} iv Unique IV
   * @param {string} at (optional) AT for AEAD mode ciphers
   * @param {string} aad (optional) AAD for AEAD mode ciphers
   * @param {function} cb User supplied callback function
   * @returns {object}
   */
  _decrypt(key, ct, algo, encodeas, iv, at, aad, cb) {
    // If non-aead cipher then expect 6 vs. 7 args
    cb = cb || aad;

    // Initialize some defaults
    let cipher, pt;

    // Create a new de-cipher object using algorithm, derived key & iv
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    cipher = this.crypto.createDecipheriv(algo, key, iv, {
      authTagLength: this._at_size
    });

    // If an AEAD cipher is used & an AT supplied, include it
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    if (this._aead_mode && at) {
      try {
        cipher.setAuthTag(Buffer.from(at, encodeas));
      } catch (err) {
        return cb("Unable to set authentication tag");
      }
    }

    // If an AEAD cipher is used & an AAD supplied, include it
    //   References: SP 800-38A, 800-38B, 800-131A, 800-175B, FIPS 197 & 198-1
    if (this._aead_mode && typeof aad !== "function") {
      try {
        cipher.setAAD(Buffer.from(aad, encodeas), {
          plaintextLength: ct.length
        });
      } catch (err) {
        return cb("Unable to set additional authentication data");
      }
    }

    // Add our ciphertext & encode
    try {
      pt = cipher.update(ct, encodeas, "utf8");
      pt += cipher.final("utf8");
    } catch(err) {
      return cb("Unable to decrypt ciphertext!");
    }

    // return the plaintext
    return cb(null, pt);
  }


  /**
   * Private function to derive a secret key
   * @param {string} secret User supplied key material
   * @param {buffer} salt Unique salt
   * @param {function} cb User supplied callback function
   * @returns {object}
   */
  _derive_key(secret, salt, cb) {
    // If salt not supplied then expect 2 vs. 3 args
    cb = cb || salt;

    // Initialize some defaults
    let key, opts = {};

    // If secret is an object then extract the parts; test harness only
    if (typeof secret === "object") {
      opts = secret.opts;
      secret = secret.secret;
    }

    // If a salt was NOT supplied, create one
    //   References: RFC 4086, 5084, SP 800-57P1, 800-108 & 800-132
    salt = (typeof salt !== "function") ?
      Buffer.from(salt) : this.crypto.randomBytes(128);

    // PBKDF2 or scrypt key derivation logic
    //   References: RFC 4086, 5084, SP 800-57P1, 800-108 & 800-132
    //   Compliance: If scrypt used does not conform to FIPS!
    try {
      if (!this._use_scrypt || typeof this.crypto.scryptSync !== "function") {
        key = this.crypto.pbkdf2Sync(secret, salt, 15000, this._key_size, this.hashing);
      } else {
        key = this.crypto.scryptSync(secret, salt, this._key_size, opts);
      }
    } catch (err) {
      return cb("Unable to derive key!");
    }

    // Return the derived key and salt
    return cb(null, {
      key: key,
      salt: salt
    });
  }


  /**
   * Private function to generate an HMAC
   * @param {string} key User supplied key material
   * @param {string} obj User supplied content to create HMAC from
   * @param {string} hashing Selected hashing algorithm
   * @param {string} encodeas Resulting encoding
   * @param {function} cb User supplied callback function
   * @returns {object}
   */
  _digest(key, obj, hashing, encodeas, cb) {

    // Initialize some defaults
    let hmac;

    // Create an HMAC from the supplied data
    //   References: SP 800-175B, FIPS 180-4 & FIPS 198-1
    try {
      hmac = this.crypto.createHmac(hashing, key);
      hmac.setEncoding(encodeas);
      hmac.write(obj);
      hmac.end();
    } catch (err) {
      return cb("Unable to generate digest!");
    }

    // Return digest
    return cb(null, hmac.read().toString(encodeas));
  }


  /**
   * Private function to generate a random value
   * @param {integer} iv_size The random buffer size
   * @returns {buffer}
   */
  _iv(iv_size) {
    return this.crypto.randomBytes(iv_size);
  }


  /**
   * Private function to generate object of algorithm key, iv & at sizes
   * @param {string} algo The cipher name
   * @returns {object}
   */
  _matrix(algo) {
    let obj = {
      _at_size: 16,
      _iv_size: 16,
      _key_size: 32
    };

    if (algo.match(/ccm|ocb|gcm/i))
      obj._iv_size = 12;

    if (algo.match(/aes/) && algo.match(/128/))
      obj._key_size = 16;

    if (algo.match(/aes/) && algo.match(/192/))
      obj._key_size = 24;

    if (algo.match(/aes/) && algo.match(/xts/))
      obj._key_size = 32;

    if (algo.match(/aes/) && algo.match(/xts/) && algo.match(/256/))
      obj._key_size = 64;

    return obj;
  }


  /**
   * Look for insecure modes
   * @returns {boolean}
   */
  _validator() {
    return (this.algorithm.match(/ccm|ecb|ocb2/));
  }


  /**
   * When encoding as asn.1 define a schema
   * @returns {object}
   */
  _schema() {
    let schema;
    if (!this._aead_mode) {

      schema = this.asn1.define('schema', function() {
        this.seq().obj(
          this.key("ct").octstr(),
          this.key("hmac").octstr(),
          this.key("iv").octstr(),
          this.key("salt").octstr()
        );
      });

    } else {

      schema = this.asn1.define('schema', function() {
        this.seq().obj(
          this.key("ct").octstr(),
          this.key("hmac").octstr(),
          this.key("iv").octstr(),
          this.key("salt").octstr(),
          this.key("at").octstr(),
          this.key("aad").octstr()
        );
      });
    }

    return schema;
  }
}


/**
 * Robot, do work
 */
module.exports = function(options) {
  return new Kruptein(options || {});
};
