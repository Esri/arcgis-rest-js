'use strict';


exports.isFunction = function isFunction(value) {
  return typeof value === 'function';
};

exports.isNumber = function isNumber(value) {
  return typeof value === 'number';
};

exports.isObject = function isObject(value) {
  return typeof value === 'object' && value !== null;
};

exports.isString = function isString(value) {
  return typeof value === 'string';
};

exports.isUndefined = function isUndefined(value) {
  return typeof value === 'undefined';
};
