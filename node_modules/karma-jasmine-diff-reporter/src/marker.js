'use strict';

// Any string coming from Jasmine will be wrapped in this character
// So it would be possible to detect the beginning and the end of a string.
// https://en.wikipedia.org/wiki/Zero-width_non-joiner
var MARKER = '\u200C';

exports.MARKER = MARKER;

exports.wrapString = function (string) {
  return MARKER + "'" + MARKER + string + MARKER + "'" + MARKER;
};

// Any string coming from Jasmine is wrapped in marker
// Remove it before output because it isn't displayed correctly in some terminals
exports.removeFromString = function (string) {
  var pattern = new RegExp(MARKER, 'g');
  return string.replace(pattern, '');
};
