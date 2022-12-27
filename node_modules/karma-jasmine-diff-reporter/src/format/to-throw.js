'use strict';

// Matcher - toThrow and toThrowError
//
// Simply compare results as primitive strings
module.exports = function formatToThrow(
  diff, expectedValue, actualValue, highlighter, options
) {
  return diff.primitive(expectedValue, actualValue, highlighter, options);
};
