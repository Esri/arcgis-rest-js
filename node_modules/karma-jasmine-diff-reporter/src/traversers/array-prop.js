'use strict';


module.exports = {

  enter: function (
    value, oppositeRootValue, highlightValue, highlighter, skipPath, options
  ) {
    var oppositeValue = oppositeRootValue.byPath(value.getPath());
    var oppositeParent = oppositeRootValue.byPath(value.parent.getPath());
    var indent = value.indent(options);

    if (value.parent.containing) {
      if (oppositeParent.includes(value)) {
        skipPath(value.getPath());
        return indent + value.out(options);
      }

      skipPath(value.getPath());
      return indent + highlightValue(value.out(options));
    }

    if (oppositeParent && oppositeParent.containing) {
      skipPath(value.getPath());
      return indent + value.out(options);
    }

    if (!oppositeValue) {
      skipPath(value.getPath());
      return indent + highlightValue(value.out(options));
    }

    return indent;
  },

  leave: function (value, options) {
    var diff = '';

    if (!value.isLast()) {
      diff += ',';
    }

    if (options.pretty) {
      diff += '\n';
    } else if (!value.isLast()) {
      diff += ' ';
    }

    return diff;
  }

};
