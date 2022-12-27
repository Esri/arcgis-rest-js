var fs = require('fs-extra');
var writeFileAtomic = require('write-file-atomic');
var path = require('path');
var retry = require('retry');
var childProcess = require('child_process');
var Bagpipe = require('bagpipe');
var objectAssign = require('object-assign');
var isWindows = process.platform === 'win32';

var helpers = {

  isSecret: function (secret) {
    return secret !== undefined && secret != null;
  },

  sessionPath: function (options, sessionId) {
    //return path.join(basepath, sessionId + '.json');
    return path.join(options.path, sessionId + options.fileExtension);
  },

  sessionId: function (options, file) {
    //return file.substring(0, file.lastIndexOf('.json'));
    if (options.fileExtension.length === 0) return file;
    var id = file.replace(options.filePattern, '');
    return id === file ? '' : id;
  },

  getLastAccess: function (session) {
    return session.__lastAccess;
  },

  setLastAccess: function (session) {
    session.__lastAccess = new Date().getTime();
  },

  escapeForRegExp: function (str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  },

  getFilePatternFromFileExtension: function (fileExtension) {
    return new RegExp(helpers.escapeForRegExp(fileExtension) + '$');
  },

  DEFAULTS: {
    path: './sessions',
    ttl: 3600,
    retries: 5,
    factor: 1,
    minTimeout: 50,
    maxTimeout: 100,
    reapInterval: 3600,
    reapMaxConcurrent: 10,
    reapAsync: false,
    reapSyncFallback: false,
    logFn: console.log || function () {
    },
    encoding: 'utf8',
    encoder: JSON.stringify,
    decoder: JSON.parse,
    encryptEncoding: 'hex',
    fileExtension: '.json',
    crypto: {
      algorithm: "aes-256-gcm",
      hashing: "sha512",
      use_scrypt: true
    },
    keyFunction: function (secret, sessionId) {
      return secret + sessionId;
    },
  },

  defaults: function (userOptions) {
    var options = objectAssign({}, helpers.DEFAULTS, userOptions);
    options.path = path.normalize(options.path);
    options.filePattern = helpers.getFilePatternFromFileExtension(options.fileExtension);

    if (helpers.isSecret(options.secret))
      options.kruptein = require('kruptein')(options.crypto);

    return options;
  },

  destroyIfExpired: function (sessionId, options, callback) {
    helpers.expired(sessionId, options, function (err, expired) {
      if (err == null && expired) {
        helpers.destroy(sessionId, options, callback);
      } else if (callback) {
        err ? callback(err) : callback();
      }
    });
  },

  scheduleReap: function (options) {
    if (options.reapInterval !== -1) {
      options.reapIntervalObject = setInterval(function () {
        if (options.reapAsync) {
          options.logFn('[session-file-store] Starting reap worker thread');
          helpers.asyncReap(options);
        } else {
          options.logFn('[session-file-store] Deleting expired sessions');
          helpers.reap(options);
        }
      }, options.reapInterval * 1000).unref();
    }
  },

  asyncReap: function (options, callback) {
    callback || (callback = function () {
    });

    function execCallback(err) {
      if (err && options.reapSyncFallback) {
        helpers.reap(options, callback);
      } else {
        err ? callback(err) : callback();
      }
    }

    if (isWindows) {
      childProcess.execFile('node', [path.join(__dirname, 'reap-worker.js'), options.path, options.ttl], execCallback);
    } else {
      childProcess.execFile(path.join(__dirname, 'reap-worker.js'), [options.path, options.ttl], execCallback);
    }
  },

  reap: function (options, callback) {
    callback || (callback = function () {
    });
    helpers.list(options, function (err, files) {
      if (err) return callback(err);
      if (files.length === 0) return callback();

      var bagpipe = new Bagpipe(options.reapMaxConcurrent);

      var errors = [];
      files.forEach(function (file, i) {
        bagpipe.push(helpers.destroyIfExpired,
          helpers.sessionId(options, file),
          options,
          function (err) {
            if (err) {
              errors.push(err);
            }
            if (i >= files.length - 1) {
              errors.length > 0 ? callback(errors) : callback();
            }
          });
      });
    });
  },

  /**
   * Attempts to fetch session from a session file by the given `sessionId`
   *
   * @param  {String}   sessionId
   * @param  {Object}   options
   * @param  {Function} callback
   *
   * @api public
   */
  get: function (sessionId, options, callback) {
    var sessionPath = helpers.sessionPath(options, sessionId);

    var operation = retry.operation({
      retries: options.retries,
      factor: options.factor,
      minTimeout: options.minTimeout,
      maxTimeout: options.maxTimeout
    });

    operation.attempt(function () {

      fs.readFile(sessionPath, helpers.isSecret(options.secret) && !options.encryptEncoding ? null : options.encoding, function readCallback(err, data) {

        if (!err) {
          var json;

          if (helpers.isSecret(options.secret))
            data = options.decoder(helpers.decrypt(options, data, sessionId));

          try {
            json = options.decoder(data);
          } catch (parseError) {
            return fs.remove(sessionPath, function (removeError) {
              if (removeError) {
                return callback(removeError);
              }

              callback(parseError);
            });
          }
          if (!err) {
            return callback(null, helpers.isExpired(json, options) ? null : json);
          }
        }

        if (operation.retry(err)) {
          options.logFn('[session-file-store] will retry, error on last attempt: ' + err);
        } else if (options.fallbackSessionFn) {
          var session = options.fallbackSessionFn(sessionId);
          helpers.setLastAccess(session);
          callback(null, session);
        } else {
          callback(err);
        }
      });
    });
  },

  /**
   * Attempts to commit the given `session` associated with the given `sessionId` to a session file
   *
   * @param {String}   sessionId
   * @param {Object}   session
   * @param  {Object}  options
   * @param {Function} callback (optional)
   *
   * @api public
   */
  set: function (sessionId, session, options, callback) {
    try {
      helpers.setLastAccess(session);

      var sessionPath = helpers.sessionPath(options, sessionId);
      var json = options.encoder(session);
      if (helpers.isSecret(options.secret)) {
        json = helpers.encrypt(options, json, sessionId);
      }
      writeFileAtomic(sessionPath, json, function (err) {
        if (callback) {
          err ? callback(err) : callback(null, session);
        }
      });
    } catch (err) {
      if (callback) callback(err);
    }
  },

  /**
   * Update the last access time and the cookie of given `session` associated with the given `sessionId` in session file.
   * Note: Do not change any other session data.
   *
   * @param {String}   sessionId
   * @param {Object}   session
   * @param {Object}   options
   * @param {Function} callback (optional)
   *
   * @api public
   */
  touch: function (sessionId, session, options, callback) {
    helpers.get(sessionId, options, function (err, originalSession) {
      if (err) {
        callback(err, null);
        return;
      }

      if (!originalSession) {
        originalSession = {};
      }

      if (session.cookie) {
        // Update cookie details
        originalSession.cookie = session.cookie;
      }
      // Update `__lastAccess` property and save to store 
      helpers.set(sessionId, originalSession, options, callback);
    });
  },

  /**
   * Attempts to unlink a given session by its id
   *
   * @param  {String}   sessionId   Files are serialized to disk by their sessionId
   * @param  {Object}   options
   * @param  {Function} callback
   *
   * @api public
   */
  destroy: function (sessionId, options, callback) {
    var sessionPath = helpers.sessionPath(options, sessionId);
    fs.remove(sessionPath, callback || function () {
    });
  },

  /**
   * Attempts to fetch number of the session files
   *
   * @param  {Object}   options
   * @param  {Function} callback
   *
   * @api public
   */
  length: function (options, callback) {
    fs.readdir(options.path, function (err, files) {
      if (err) return callback(err);

      var result = 0;
      files.forEach(function (file) {
        if (options.filePattern.exec(file)) {
          ++result;
        }
      });

      callback(null, result);
    });
  },

  /**
   * Attempts to clear out all of the existing session files
   *
   * @param  {Object}   options
   * @param  {Function} callback
   *
   * @api public
   */
  clear: function (options, callback) {
    fs.readdir(options.path, function (err, files) {
      if (err) return callback([err]);
      if (files.length <= 0) return callback();

      var errors = [];
      files.forEach(function (file, i) {
        if (options.filePattern.exec(file)) {
          fs.remove(path.join(options.path, file), function (err) {
            if (err) {
              errors.push(err);
            }
            // TODO: wrong call condition (call after all completed attempts to remove instead of after completed attempt with last index)
            if (i >= files.length - 1) {
              errors.length > 0 ? callback(errors) : callback();
            }
          });
        } else {
          // TODO: wrong call condition (call after all completed attempts to remove instead of after completed attempt with last index)
          if (i >= files.length - 1) {
            errors.length > 0 ? callback(errors) : callback();
          }
        }
      });
    });
  },

  /**
   * Attempts to find all of the session files
   *
   * @param  {Object}   options
   * @param  {Function} callback
   *
   * @api public
   */
  list: function (options, callback) {
    fs.readdir(options.path, function (err, files) {
      if (err) return callback(err);

      files = files.filter(function (file) {
        return options.filePattern.exec(file);
      });

      callback(null, files);
    });
  },

  /**
   * Attempts to detect whether a session file is already expired or not
   *
   * @param  {String}   sessionId
   * @param  {Object}   options
   * @param  {Function} callback
   *
   * @api public
   */
  expired: function (sessionId, options, callback) {
    helpers.get(sessionId, options, function (err, session) {
      if (err) return callback(err);

      err ? callback(err) : callback(null, helpers.isExpired(session, options));
    });
  },

  isExpired: function (session, options) {
    if (!session) return true;

    var ttl = session.cookie && session.cookie.originalMaxAge ? session.cookie.originalMaxAge : options.ttl * 1000;
    return !ttl || helpers.getLastAccess(session) + ttl < new Date().getTime();
  },

  encrypt: function (options, data, sessionId) {
    var ciphertext = null;

    options.kruptein.set(options.secret, data, function(err, ct) {
      if (err)
        throw err;

      ciphertext = ct;
    });

    return ciphertext;
  },

  decrypt: function (options, data, sessionId) {
    var plaintext = null;

    options.kruptein.get(options.secret, data, function(err, pt) {
      if (err)
        throw err;

      plaintext = pt;
    });
    
    return plaintext;
  }
};

module.exports = helpers;
