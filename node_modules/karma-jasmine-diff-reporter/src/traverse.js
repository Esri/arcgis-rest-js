'use strict';

function noop() {
  return function () {};
}

function pathStartsWith(path, subpath) {
  return subpath.every(function (key, index) {
    return path[index] === key;
  });
}

function isSkipped(path, skippedPaths) {
  return skippedPaths.some(function (skippedPath) {
    return pathStartsWith(path, skippedPath);
  });
}

function traverse(value, options, skippedPaths) {
  options = options || {};
  var enter = options.enter || noop();
  var leave = options.leave || noop();
  var enterProp = options.enterProp || noop();
  var leaveProp = options.leaveProp || noop();

  skippedPaths = skippedPaths || [];

  function skipPath(skippedPath) {
    skippedPaths.push(skippedPath);
  }

  if (value.parent) {
    enterProp(value, skipPath);
  }

  if (isSkipped(value.getPath(), skippedPaths)) {
    if (value.parent) {
      leaveProp(value);
    }
    return;
  }

  enter(value, skipPath);

  if (isSkipped(value.getPath(), skippedPaths)) {
    if (value.parent) {
      leaveProp(value);
    }
    return;
  }

  value.children.forEach(function (child) {
    traverse(child, options, skippedPaths);
  });

  leave(value);

  if (value.parent) {
    leaveProp(value);
  }
}

module.exports = traverse;
