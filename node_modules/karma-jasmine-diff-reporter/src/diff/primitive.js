'use strict';

var jsDiff = require('diff');


module.exports = function diffPrimitives(
  expectedValue, actualValue, highlighter, options
) {
  var result = {
    expected: expectedValue.indent(options),
    actual: actualValue.indent(options)
  };

  var diff = jsDiff.diffWordsWithSpace(
    expectedValue.out(options),
    actualValue.out(options)
  );

  diff.forEach(function (part) {
    var value = part.value;

    if (part.added) {
      result.actual += highlighter.actual(value);
    } else if (part.removed) {
      result.expected += highlighter.expected(value);
    } else {
      result.expected += value;
      result.actual += value;
    }
  });

  return result;
};
