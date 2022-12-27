'use strict';

var complex = require('./complex');
var full = require('./full');
var multiple = require('./multiple');
var passthru = require('./passthru');
var primitive = require('./primitive');
var warning = require('./warning');

module.exports = {
  complex: complex,
  full: full,
  multiple: multiple,
  passthru: passthru,
  primitive: primitive,
  warning: warning
};
