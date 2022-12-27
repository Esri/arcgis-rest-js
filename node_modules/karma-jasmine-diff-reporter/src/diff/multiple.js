'use strict';

var diffComplex = require('./complex');

module.exports = function diffMultiple(
  expectedValue, actualValue, highlighter, options
) {
  // Jasmine outputs arguments for all calls in multiple arrays
  // Only actual value should be "multiple"
  if (actualValue.multiple) {
    // Compare expected value with every actual value
    var actualDiffs = actualValue.children.map(function (actualChildValue) {
      // Remove parent to equalize the paths
      actualChildValue.removeParent();

      // Swap actual and expected arguments to get correct diffs
      return diffComplex.format(
        actualChildValue, expectedValue, highlighter.actual, highlighter, options
      );
    });

    var separator = ',';
    if (options.pretty) {
      separator += '\n';
    } else {
      separator += ' ';
    }

    var actual = actualDiffs.join(separator);

    // Do not display any diffs for expected value, because it is being compared
    // to multiple values, so it won't make any sense. Simply construct it
    // without colors against any of the actual values.
    // Parent has been already removed by reference in the loop above.
    var firstActualValue = actualValue.children[0];

    var expected = diffComplex.format(
      expectedValue, firstActualValue, highlighter.silent, highlighter, options
    );

    return {
      expected: expected,
      actual: actual
    };
  }

  return diffComplex(expectedValue, actualValue, highlighter, options);
};
