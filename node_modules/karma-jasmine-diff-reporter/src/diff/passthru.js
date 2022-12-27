'use strict';


module.exports = function diffPassthru(
  expectedValue, actualValue, highlighter, options
) {
  return {
    expected: expectedValue.out(options),
    actual: actualValue.out(options),
    passthru: true
  };
};
