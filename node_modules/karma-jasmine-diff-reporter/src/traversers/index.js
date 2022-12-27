'use strict';

var Value = require('../Value');

var objectTraverser = require('./object');
var objectPropTraverser = require('./object-prop');
var arrayPropTraverser = require('./array-prop');
var arrayTraverser = require('./array');
var propTraverser = require('./prop');


exports.forValue = function (value) {
  var formatters = {};
  formatters[Value.OBJECT] = objectTraverser;
  formatters[Value.INSTANCE] = objectTraverser;
  formatters[Value.ARRAY] = arrayTraverser;

  var formatter = formatters[value.type] || propTraverser;

  return formatter;
};

exports.forProp = function (value) {
  var propTraversers = {};
  propTraversers[Value.OBJECT] = objectPropTraverser;
  propTraversers[Value.INSTANCE] = objectPropTraverser;
  propTraversers[Value.ARRAY] = arrayPropTraverser;

  var formatter = propTraversers[value.parent.type];

  return formatter;
};
