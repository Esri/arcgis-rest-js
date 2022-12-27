'use strict';

var isUndefined = require('./lang').isUndefined;

exports.defaults = function defaults(object, source) {
  Object.keys(source).forEach(function (key) {
    if (isUndefined(object[key])) {
      object[key] = source[key];
    }
  });
  return object;
};

exports.extend = function extend(object, source) {
  Object.keys(source).forEach(function (key) {
    object[key] = source[key];
  });
  return object;
};
