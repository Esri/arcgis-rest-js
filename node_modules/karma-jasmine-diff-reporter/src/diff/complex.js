'use strict';

var traverse = require('../traverse');
var traversers = require('../traversers');


function formatComplex(
  value, oppositeValue, highlightValue, highlighter, options
) {
  var diff = value.indent(options);

  traverse(value, {

    enterProp: function (enterValue, skipPath) {
      var propTraverser = traversers.forProp(enterValue);
      diff += propTraverser.enter(
        enterValue, oppositeValue, highlightValue, highlighter, skipPath, options
      );
    },

    enter: function (enterValue, skipPath) {
      var traverser = traversers.forValue(enterValue);
      diff += traverser.enter(
        enterValue, oppositeValue, highlightValue, highlighter, skipPath, options
      );
    },

    leave: function (leaveValue) {
      var traverser = traversers.forValue(leaveValue);
      diff += traverser.leave(leaveValue, options);
    },

    leaveProp: function (leaveValue) {
      var propTraverser = traversers.forProp(leaveValue);
      diff += propTraverser.leave(leaveValue, options);
    }

  });

  return diff;
}

function diffComplex(
  expectedValue, actualValue, highlighter, options
) {
  var result = {};

  result.expected = formatComplex(
    expectedValue, actualValue, highlighter.expected, highlighter, options
  );

  result.actual = formatComplex(
    actualValue, expectedValue, highlighter.actual, highlighter, options
  );

  return result;
}

diffComplex.format = formatComplex;

module.exports = diffComplex;
