module.exports = Loader;

function Loader(options) {
  options = options || {};
  this.require_ = options.requireShim || requireShim;
  this.import_ = options.importShim || importShim;
}

Loader.prototype.load = function(path, alwaysImport) {
  if (alwaysImport || path.endsWith('.mjs')) {
    // The ES module spec requires import paths to be valid URLs. As of v14,
    // Node enforces this on Windows but not on other OSes.
    const url = `file://${path}`;
    return this.import_(url).catch(function(e) {
      if (e.message.indexOf(path) !== -1 || e.stack.indexOf(path) !== -1) {
        return Promise.reject(e);
      } else {
        // When an ES module has a syntax error, the resulting exception does not
        // include the filename. Add it. We lose the stack trace in the process,
        // but the stack trace is usually not useful since it contains only frames
        // from the Node module loader.
        const updatedError = new Error(`While loading ${path}: ${e.constructor.name}: ${e.message}`);
        return Promise.reject(updatedError);
      }
    });
  } else {
    return new Promise(resolve => {
      this.require_(path);
      resolve();
    });
  }
};

function requireShim(path) {
  require(path);
}

function importShim(path) {
  return import(path);
}
