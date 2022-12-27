'use strict';

var stringUtils = require('./utils/string');
var collectionUtils = require('./utils/collection');

function Value(type, text, options) {
  options = options || {};

  this.type = type;
  this.text = text;

  this.key = typeof options.key !== 'undefined' ? options.key + '' : '';
  this.any = options.any || false;
  this.containing = options.containing || false;
  this.multiple = options.multiple || false;
  this.instance = options.instance || 'Object';

  this.children = options.children || [];

  this.parent = null;
  this.prev = null;
  this.next = null;
  this.level = 0;

  this.updateReferences();
}

Value.prototype.updateReferences = function (level) {
  level = typeof level === 'undefined' ? this.level + 1 : level;
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];
    child.parent = this;
    child.prev = this.children[i - 1] || null;
    child.next = this.children[i + 1] || null;
    child.level = level;

    child.updateReferences(level + 1);
  }
  return this;
};

Value.prototype.removeParent = function () {
  this.parent = null;
  this.key = '';
  this.level = 0;
  this.updateReferences();
  return this;
};

Value.prototype.getPath = function () {
  var path = [this.key];
  var parent = this.parent;
  while (parent && parent.key) {
    path.unshift(parent.key);
    parent = parent.parent;
  }
  return path;
};

Value.prototype.getParentPath = function () {
  var path = this.getPath();
  var parentPath = path.slice(0, path.length - 1);
  return parentPath;
};

Value.prototype.byPath = function (path) {
  // Root has empty key
  if (!path.length || path[0] === '') {
    return this;
  }

  if (!this.isComplex()) {
    return null;
  }

  var result = this;

  for (var i = 0; i < path.length; i++) {
    var key = path[i];
    var found = collectionUtils.findBy(result.children, 'key', key);
    if (!found) {
      return null;
    }

    result = found;
  }

  return result;
};

Value.prototype.out = function (options) {
  options = options || {};
  options.verbose = options.verbose || {};

  if (this.any) {
    return '<jasmine.any(' + this.text + ')>';
  }

  var out = '';

  if (this.type === Value.OBJECT && options.verbose.object) {
    out += 'Object(';
  }

  out += this.text;

  if (this.type === Value.OBJECT && options.verbose.object) {
    out += ')';
  }

  return out;
};

Value.prototype.indent = function (options) {
  var indent = '';

  if (options.pretty) {
    if (options.multiline) {
      indent += options.multiline.indent;
    }
    indent += stringUtils.times(options.pretty, this.level);
  } else if (options.multiline && this.level === 0) {
    // When not pretty, only add multiline offset to parent
    indent += options.multiline.indent;
  }

  return indent;
};

Value.prototype.includes = function (value) {
  for (var i = 0; i < this.children.length; i++) {
    if (value.isEqual(this.children[i])) {
      return true;
    }
  }
  return false;
};

Value.prototype.isLast = function () {
  return this.next === null;
};

Value.prototype.isEqual = function (value) {
  return this.out() === value.out();
};

Value.prototype.isPrimitive = function () {
  return !this.isComplex();
};

// Tells if type should be highlighted as warning
Value.prototype.isComplex = function () {
  var complexTypes = [
    Value.ARRAY,
    Value.OBJECT,
    Value.INSTANCE,
    Value.FUNCTION,
    Value.NODE,
    Value.GLOBAL,
    Value.CIRCULAR_REFERENCE,
    Value.ELLIPSIS,
    Value.DEEP_ARRAY
  ];
  return complexTypes.indexOf(this.type) !== -1;
};

Value.prototype.canNest = function () {
  var nestTypes = [
    Value.ARRAY,
    Value.OBJECT,
    Value.INSTANCE
  ];
  return nestTypes.indexOf(this.type) !== -1;
};

// Identified primitives (for "any")

Value.UNDEFINED = 'UNDEFINED';
Value.NULL = 'NULL';
Value.BOOLEAN = 'BOOLEAN';
Value.STRING = 'STRING';
Value.NUMBER = 'NUMBER';

// Complex, can nest
Value.ARRAY = 'ARRAY';
Value.OBJECT = 'OBJECT';
Value.INSTANCE = 'INSTANCE';

// Complex, can NOT nest
Value.FUNCTION = 'FUNCTION';
Value.NODE = 'NODE';
Value.GLOBAL = 'GLOBAL';
Value.CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE';
Value.ELLIPSIS = 'ELLIPSIS';
Value.DEEP_ARRAY = 'DEEP_ARRAY';

// Jasmine-specific
Value.ANYTHING = 'ANYTHING';
Value.SPY = 'SPY';

// Basic types compared as strings,
// anything not parsed will be considered primitive
Value.PRIMITIVE = 'PRIMITIVE';

module.exports = Value;
