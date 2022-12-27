'use strict';


module.exports = function diffWarning(
  expectedValue, actualValue, highlighter, options
) {
  return {
    expected: expectedValue.indent(options) +
              highlighter.warning(expectedValue.out(options)),
    actual: actualValue.indent(options) +
            highlighter.warning(actualValue.out(options))
  };
};
