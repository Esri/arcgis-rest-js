'use strict';


module.exports = function diffFull(
  expectedValue, actualValue, highlighter, options
) {
  return {
    expected: expectedValue.indent(options) +
              highlighter.expected(expectedValue.out(options)),
    actual: actualValue.indent(options) +
            highlighter.actual(actualValue.out(options))
  };
};
