'use strict';

// Repeat string "count" times
exports.times = function times(string, count) {
  var result = '';
  for (var i = 0; i < count; i++) {
    result += string;
  }
  return result;
};

// Check if string ends with substring
exports.endsWith = function endsWith(string, substring) {
  if (substring.length > string.length) return false;
  var index = string.length - substring.length;
  return string.lastIndexOf(substring) === index;
};
