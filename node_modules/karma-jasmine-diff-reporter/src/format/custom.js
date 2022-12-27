'use strict';

var isFunction = require('../utils/lang').isFunction;
var isString = require('../utils/lang').isString;


// Behave like toEqual, deep compare the values
module.exports = function formatCustom(
  diff, expectedValue, actualValue, highlighter, options
) {
  var format = options.matcher.format;

  if (isFunction(format)) {
    return format(diff, expectedValue, actualValue, highlighter, options);
  }

  var diffFn;
  if (isString(format)) {
    diffFn = diff[format];
  }
  if (!isFunction(diffFn)) {
    diffFn = diff.complex;
  }

  return diffFn(expectedValue, actualValue, highlighter, options);
};
