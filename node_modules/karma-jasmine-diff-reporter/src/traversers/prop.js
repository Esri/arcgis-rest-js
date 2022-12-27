'use strict';

var Value = require('../Value');


module.exports = {

  enter: function (
    value, oppositeRootValue, highlightValue, highlighter, options
  ) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());

    if (value.type === Value.ANYTHING || oppositeValue.type === Value.ANYTHING) {
      return value.out(options);
    }

    // Different types are not comparable
    if (value.type !== oppositeValue.type) {
      return highlightValue(value.out(options));
    }

    // Don't highlight "any" for same types
    if (value.any || oppositeValue.any) {
      return value.out(options);
    }

    if (value.isComplex()) {
      if (value.canNest()) {
        // Should not land here
        // If it nests, then it should be handled higher before particular formatter
      } else {
        return highlighter.warning(value.out(options));
      }
    }

    if (value.out(options) !== oppositeValue.out(options)) {
      return highlightValue(value.out(options));
    }

    return value.out(options);
  },

  leave: function () {
    return '';
  }

};
