'use strict';


module.exports = {

  enter: function (
    value, oppositeRootValue, highlightValue, highlighter, skipPath, options
  ) {
    var diff = '';

    if (value.containing) {
      diff += '<jasmine.arrayContaining(';
    }

    diff += '[';

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

    var diff = '';

    if (options.pretty) {
      diff += indent;
    } else {
      diff += ' ';
    }

    diff += ']';

    if (value.containing) {
      diff += ')>';
    }

    return diff;
  }

};
