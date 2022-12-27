'use strict';

// Matcher - toHaveBeenCalledWith
//
// Behaves like toEqual, deep compare results as arrays
// There is also the case when Jasmine outputs arguments for all
// calls in multiple arrays.
module.exports = function formatToHaveBeenCalled(
  diff, expectedValue, actualValue, highlighter, options
) {
  return diff.multiple(expectedValue, actualValue, highlighter, options);
};
