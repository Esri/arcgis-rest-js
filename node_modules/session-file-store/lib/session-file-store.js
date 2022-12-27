var helpers = require('./session-file-helpers');
var fs = require('fs-extra');

/**
 * https://github.com/expressjs/session#session-store-implementation
 *
 * @param {object} session  express session
 * @return {Function} the `FileStore` extending `express`'s session Store
 *
 * @api public
 */
module.exports = function (session) {
  var Store = session.Store;

  /**
   * Initialize FileStore with the given `options`
   *
   * @param {Object} options (optional)
   *
   * @api public
   */
  function FileStore(options) {
    var self = this;

    options = options || {};
    Store.call(self, options);

    self.options = helpers.defaults(options);
    fs.mkdirsSync(self.options.path);
    helpers.scheduleReap(self.options);
    options.reapIntervalObject = self.options.reapIntervalObject;
  }

  /**
   * Inherit from Store
   */
  FileStore.prototype.__proto__ = Store.prototype;

  /**
   * Attempts to fetch session from a session file by the given `sessionId`
   *
   * @param  {String}   sessionId
   * @param  {Function} callback
   *
   * @api public
   */
  FileStore.prototype.get = function (sessionId, callback) {
    helpers.get(sessionId, this.options, callback);
  };

  /**
   * Attempts to commit the given session associated with the given `sessionId` to a session file
   *
   * @param {String}   sessionId
   * @param {Object}   session
   * @param {Function} callback (optional)
   *
   * @api public
   */
  FileStore.prototype.set = function (sessionId, session, callback) {
    helpers.set(sessionId, session, this.options, callback);
  };

  /**
   * Touch the given session object associated with the given `sessionId`
   *
   * @param {string} sessionId
   * @param {object} session
   * @param {function} callback
   *
   * @api public
   */
  FileStore.prototype.touch = function (sessionId, session, callback) {
    helpers.touch(sessionId, session, this.options, callback);
  };

  /**
   * Attempts to unlink a given session by its id
   *
   * @param  {String}   sessionId   Files are serialized to disk by their
   *                                sessionId
   * @param  {Function} callback
   *
   * @api public
   */
  FileStore.prototype.destroy = function (sessionId, callback) {
    helpers.destroy(sessionId, this.options, callback);
  };

  /**
   * Attempts to fetch number of the session files
   *
   * @param  {Function} callback
   *
   * @api public
   */
  FileStore.prototype.length = function (callback) {
    helpers.length(this.options, callback);
  };

  /**
   * Attempts to clear out all of the existing session files
   *
   * @param  {Function} callback
   *
   * @api public
   */
  FileStore.prototype.clear = function (callback) {
    helpers.clear(this.options, callback);
  };

  /**
   * Attempts to find all of the session files
   *
   * @param  {Function} callback
   *
   * @api public
   */
  FileStore.prototype.list = function (callback) {
    helpers.list(this.options, callback);
  };

  /**
   * Attempts to detect whether a session file is already expired or not
   *
   * @param  {String}   sessionId
   * @param  {Function} callback
   *
   * @api public
   */
  FileStore.prototype.expired = function (sessionId, callback) {
    helpers.expired(sessionId, this.options, callback);
  };

  return FileStore;
};
