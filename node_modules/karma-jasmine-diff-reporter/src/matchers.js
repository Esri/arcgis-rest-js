'use strict';

var formatToBe = require('./format/to-be');
var formatToEqual = require('./format/to-equal');
var formatToHaveBeenCalledWith = require('./format/to-have-been-called-with');
var formatToThrow = require('./format/to-throw');

var extend = require('./utils/object').extend;


var DEFAULT_MATCHERS = {

  toBe: {
    format: formatToBe,
    pattern: /Expected ([\S\s]*) to be ([\S\s]*)\./,
    reverse: true
  },

  toEqual: {
    format: formatToEqual,
    pattern: /Expected ([\S\s]*) to equal ([\S\s]*)\./,
    reverse: true
  },

  toHaveBeenCalledWith: {
    format: formatToHaveBeenCalledWith,
    pattern: /Expected spy .* to have been called with ([\S\s]*) but actual calls were ([\S\s]*)\./
  },

  toThrow: {
    format: formatToThrow,
    pattern: /Expected function to throw ([\S\s]*), but it threw ([\S\s]*)\./
  }

};

exports.extend = function (customMatchers) {
  customMatchers = customMatchers || {};

  var allMatchers = {};

  extend(allMatchers, DEFAULT_MATCHERS);

  extend(allMatchers, customMatchers);

  return allMatchers;
};
