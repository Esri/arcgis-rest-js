module.exports = function(session) {
  return require('./lib/session-file-store')(session);
};
