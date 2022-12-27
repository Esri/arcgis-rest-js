'use strict';

var marker = require('../../src/marker');

module.exports = function mark(string) {
  return marker.wrapString(string);
};
