'use strict';

var Value = require('../Value');

module.exports = {

  enter: function (
    value, oppositeRootValue, highlightValue, highlighter, skipPath, options
  ) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());

    // Different types are not comparable
    if (value.type !== oppositeValue.type) {
      skipPath(value.getPath());
      return highlightValue(value.out(options));
    }

    if (value.any || oppositeValue.any) {
      skipPath(value.getPath());
      return value.out(options);
    }

    if (value.instance !== oppositeValue.instance) {
      skipPath(value.getPath());
      return highlightValue(value.text);
    }

    var diff = '';

    if (value.containing) {
      diff += '<jasmine.objectContaining(';
    }

    // Strip only object, instances should keep their output
    if (value.type !== Value.OBJECT || options.verbose.object) {
      diff += value.instance;
      diff += '(';
    }

    diff += '{';

    if (options.pretty) {
      diff += '\n';
    } else {
      diff += ' ';
    }

    if (value.children.length === 0) {
      if (options.pretty) {
        diff += '\n';
      }
    }

    return diff;
  },

  leave: function (value, options) {
    var indent = value.indent(options);

    var diff = indent;

    if (!options.pretty) {
      diff += ' ';
    }

    diff += '}';

    // Strip only object, instances should keep their output
    if (value.type !== Value.OBJECT || options.verbose.object) {
      diff += ')';
    }

    if (value.containing) {
      diff += ')>';
    }

    return diff;
  }

};
