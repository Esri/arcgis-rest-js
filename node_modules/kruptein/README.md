kruptein
========
crypto; from `kruptein` to hide or conceal.

[![npm](https://img.shields.io/npm/v/kruptein.svg)](https://npmjs.com/package/kruptein)
![Downloads](https://img.shields.io/npm/dm/kruptein.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/jas-/kruptein/badge.svg)](https://snyk.io/test/github/jas-/kruptein)
[![Build Status](https://travis-ci.org/jas-/kruptein.png?branch=master)](https://travis-ci.org/jas-/kruptein)

Install
-------
To install `npm install kruptein`

Methods
-------
*   `.set(secret, plaintext, [aad], callback)`
*   `.get(secret, ciphertext, [{at: auth_tag, aad: aad}], callback)`

Options
-------
Industry standards are used for the algorithm, hashing algorithm, key & IV sizes. The default key derivation
is pbkdf2, however use of the scrypt derivation function can be enabled.
*   `algorithm`: (Optional) Cipher algorithm from `crypto.getCiphers()`. Default: `aes-256-gcm`.
*   `hashing`: (Optional) Hash algorithm from `crypto.getHashes()`. Default: `sha512`.
*   `encodeas`: (Optional) Output encoding. Currently supports `binary`, `hex`, & `base64`. Default: `binary`.
*   `key_size`: (Optional) Key size bytes (should match block size of algorithm). Default: `32`
*   `iv_size`: (Optional) IV size bytes. Default: `16`.
*   `at_size`: (Optional) Authentication tag size. Applicable to `gcm` & `ocb` cipher modes. Default: `128`.
*   `use_scrypt`: (Optional) Use `.scrypt()` to derive a key. Requires node > v10. Default/Fallback: `.pbkdf2()`.
*   `use_asn1`: (Optional) If enabled the resulting object is [ASN.1](https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/) encoded. Default: false

Tests
-----
To test use `npm test` or `node .test/vanilla.js`

Usage
-----
When selecting an algorithm from `crypto.getCiphers()` the
`iv` and `key_size` values are calculated auto-magically to make implementation
easy.

You can always define your own if the defaults per algorithm and mode
aren't what you would like; see the `options` section above.

Create ciphertext from plaintext
-----------------
To create a new ciphertext object.

```javascript
const kruptein = require("kruptein")(opts);
let secret = "squirrel";

kruptein.set(secret, "Operation mincemeat was an example of deception", (err, ct) => {
  if (err)
    throw err;

  console.log(ct);
});
```

Get plaintext from ciphertext
------------------
To retrieve plaintext from a ciphertext object.

```javascript
const kruptein = require("kruptein")(opts);
let ciphertext, secret = "squirrel";

kruptein.get(secret, ciphertext, (err, pt) => {
  if (err)
    throw err;

  console.log(pt);
});
```

Output
------
The `.set()` method output depends on three factors; the `encodeas`,
`algorithm` and `use_asn1`.

For any algorithm that supports authentication (AEAD), the object
structure includes the `Authentication Tag` and the `Additional
Authentication Data` attribute and value.

When the `use_asn1` option is enabled, the result is an [ASN.1](https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/)
value using the `encodeas` value. While this is a more complex
encoding option, it should help standardize the output for database storage.


Non-Authenticated Ciphers
-------------------------
For those ciphers that __DO NOT__ support [authentication modes](https://csrc.nist.gov/projects/block-cipher-techniques/bcm/modes-develoment)
the following structure is returned.

```json
{
  'hmac': "<binary format of calculated hmac>",
  'ct': "<binary format of resulting ciphertext>",
  'iv': "<buffer format of generated/supplied iv>",
  'salt': "<buffer format of generated/supplied salt>"
}
```

Authenticated Ciphers
---------------------
For those ciphers that __DO__ support [authentication modes](https://csrc.nist.gov/projects/block-cipher-techniques/bcm/modes-develoment)
the following structure is returned.

__Important__: Note that in the event additional authentication data (aad) is
not provided a random 128 byte salt is used.

```json
{
  'hmac': "<binary format of calculated hmac>",
  'ct': "<binary format of resulting ciphertext>",
  'iv': "<buffer format of generated/supplied iv>",
  'salt': "<buffer format of generated/supplied salt>",
  'at': "<buffer format of generated authentication tag>",
  'aad': "<buffer format of generated/supplied additional authentication data>"
}
```

ASN.1 Encoding
-------------------------
When the `use_asn1` option is enabled an [ASN.1](https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/)
value encoded with the format specifed with `encodeas` option is returned regardless of the cipher mode. This
return type will ensure compatibility with various database engines and the character set encoding available
for them.

Examples:
```
# enocdeas = binary
0\u0001n\u0004\u0019ÂÃ»Â Ã¬Ã#$ÃÃ´Ã½\u001d(a6'P>\u00042Ã©UÃÃ2ÃÂ¨Â©kÂdkÃ§EÃ¶Â«\"Â°ÂÂLI,Ã½<\rÃÂ±IÂ»\b\u0004\u0010N6KÂ±Ã¼\u001eC\nÃÃ®.E\u0004ÀÂ¿KÂ¼nOÂ¶%ÂÂ­ÃÃ&jc6_Ãª.WÃ»}Ãy`1KCZiÂÃ'QHÃ¯\rÂqÃ¦Ã Ã´\u0011Ã·ÂFfÂÃ«\\`\u0015ÂºÂ§ÂÂÂ\u000fÂÃÂ\u0014TÂÂPÃ¥Â¸ÃÃ´}Ã½\u0002ÂÂ°1Â¡ÃÂ¯Ã°Â­Ã\u0015%j$<Ã£Ã¥\nÃ½ÃÂ¦ÃdÃ¦Ã«L ÂT@v\\]\u001a\u0006Â³Ã;XÂ\b\u0005Â¥d8\u0017Ã¨Â¢Â§ÂµÃ½\"Ã´Ã»\u0019\u0004\u0010:\"çM¦ÔÖÌE\u001fEÌ\b\u00046=Â²ÂÂÂ¿Ã½9Ã¡ Ã\u0001Ã¸Ã¡ÃµÂÃ½#Ã¾ÂÃ£Ã¾Ã¹ÂºN%ÃÂ ÃÂH

# encodeas = hex
308201d80422313764663766313962303939393863306536366436643837646233346263386338630440373661643461633462653765343330393738363164646139636663343139646165386533363838333836613133376431623930373138326532663035613232300418656437323161333938323737393231623463613835383563048201006634346438623633316162343762396163303739393931336266633464356162323633356163313635383533613232623934386464646161323762303839646130623764323830303063303938333332343462383536323737383134386262653261383937623562376538613730333834616233363939613366633433636630616231663366636364393038356436653135343666626364313030643761333563623530313030333838316264346133663961313961336666343132323535386266383764613863643437336635383938326161666637646533303030373564643034623264383862333733323332333565386132626234383461663530623604102b981bf150521b81819449afa614c644044062353937313939343438623035663932383837363763343161636335653634393664313634303430343833346466626634646462653963663730303462353739

# encodeas = base64
MIIBSQQYakpmVURhKzE1Qml1SGQyUGdKUnI2RFk9BCxtb1BmcFNPU3ZicXpBSHQzcTlpRTMvRkdrVlk3cHpvTHd4dmR3bUdIcHVFPQQQUzc3eVczRndzdDdUQXhYcgSBrFhVYXVtdDV4Vmo5T1A0TE85L0dYMmNSdkFQSGZUNGhUa2sycVdUWGs3R05EZnI0QXZRMmdJYWREVHFZVmFRdjQzcXNWeUQzcXVpWVRRbXZSM0lNeUIzUnBlc0dIeDFMWHFOdDFXWXFONVdLVnhHQzVXcEc4dVdpc2t5bEh4bWNGcDRlUFNKMDJaUGpkSytGOGxJNzZ0bnJSYWJSemxaN0RNNmhYeFpnWEdtUT0EEE5WruRF8rNh3q0MHjdhZz8ELE91ZjFMUERhdW5JOHJSODNGeVd2cU56ZmZFQWdxUUVFdlpMZkx6VEdGbk09
```

Cryptography References
-----------------------
This module conforms to industry recommendations regarding algorithm type,
mode, key size, iv size & implementation, digests, key derivation & management
etc. References used provided here:

**RFC:**
*   [RFC 2104](https://tools.ietf.org/html/rfc2104): HMAC: Keyed-Hashing for Message Authentication
*   [RFC 4086](https://tools.ietf.org/html/rfc4086): Randomness Requirements for Security
*   [RFC 5084](https://tools.ietf.org/html/rfc5084): Using AES-CCM and AES-GCM Authenticated Encryption
*   [RFC 7914](https://tools.ietf.org/html/rfc7914): The scrypt Password-Based Key Derivation Function
*   [RFC 8018](https://tools.ietf.org/html/rfc8018): Password-Based Cryptography Specification
*   [X.697](https://www.itu.int/rec/T-REC-X.697-201710-I/en): ASN.1 encoding rules: Specifications of JavaScript Object Notation Encoding Rules (JER)

**NIST:**
*   [SP 800-38A](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf): Block cipher modes of operation
*   [SP 800-38B](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf): Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC
*   [SP 800-57P1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf): Recommendations for key management
*   [SP 800-107](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-107r1.pdf): Recommendation for Applications Using Approved Hash Algorithms
*   [SP 800-108](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-108.pdf): Recommendation for Key Derivation Using Pseudorandom Functions
*   [SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf): Transitioning the Use of Cryptographic Algorithms and Key Lengths
*   [SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf): Recommendation for Password-Based Key Derivation
*   [SP 800-175B](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-175B.pdf): Guideline for Using Cryptographic Standards in the Federal Government

**FIPS:**
*   [FIPS 197](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf): Advanced Encryption Standard (AES)
*   [FIPS 198-1](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.198-1.pdf): The Keyed-Hash Message Authentication Code (HMAC)
*   [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf): Secure Hash Standard (SHS)

Contributing
------------
Contributions are welcome & appreciated!

Refer to the [contributing document](https://github.com/jas-/kruptein/blob/master/CONTRIBUTING.md)
to help facilitate pull requests.

License
-------
This software is licensed under the [MIT License](https://github.com/jas-/kruptein/blob/master/LICENSE).

Copyright Jason Gerfen, 2019.
