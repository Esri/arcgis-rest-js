// Most of the code is originaly written by Jasmine developers.
// https://github.com/jasmine/jasmine
//
// It's license:
//
// Copyright (c) 2008-2015 Pivotal Labs. This software is licensed under the MIT License.
// https://github.com/jasmine/jasmine/blob/master/MIT.LICENSE
//
//
// File was modified and reused by karma-jasmine-diff-reporter project
// https://github.com/mradionov/karma-jasmine-diff-reporter
//
// It's license:
// https://github.com/mradionov/karma-jasmine-diff-reporter/blob/master/LICENSE


(function (window) {

// Because Jasmine hides all objects and does not allow to extend it easily
// I am replacing the entire Jasmine's pretty print module with a patched copy
// Version of pretty print module taken from Jamsine 2.3.4
// Patched methods:
//  StringPrettyPrinter.prototype.emitString
//  StringPrettyPrinter.prototype.emitObject

window.jasmine.pp = ppPatched(window.jasmine);


// Wrap a string into a "zero-width non-joiner" char, so it would be
// possible to detect where string ends and starts.
// It is still possible that original string will have it inside,
// so the parser will fail in that case.
// The reason zwnj is picked because it won't be visible in other reporters,
// and it seems that is used rarily.
// https://en.wikipedia.org/wiki/Zero-width_non-joiner
var MARKER = '\u200C';

function markString(string) {
  return MARKER + '\'' + MARKER + string + MARKER + '\'' + MARKER;
}

// https://github.com/mradionov/karma-jasmine-diff-reporter/issues/16
// Objects might have their properties specified in different order, it might
// result in a not very correct diff, when the same prop appears in different
// places of compared objects. Fix it by soring object properties in
// alphabetical order.
// NOTE: Order of props is not guaranteed in JS,
// see http://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
// But according to: http://stackoverflow.com/a/29622653/1573638
// "most of the browser's implementations values in objects are stored
// in the order in which they were added" - we can use it, it won't harm anyway
function sortObject(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}

function ppPatched(j$) {

  function PrettyPrinter() {
    this.ppNestLevel_ = 0;
    this.seen = [];
  }

  PrettyPrinter.prototype.format = function(value) {
    this.ppNestLevel_++;
    try {
      if (j$.util.isUndefined(value)) {
        this.emitScalar('undefined');
      } else if (value === null) {
        this.emitScalar('null');
      } else if (value === 0 && 1/value === -Infinity) {
        this.emitScalar('-0');
      } else if (value === j$.getGlobal()) {
        this.emitScalar('<global>');
      } else if (value.jasmineToString) {
        this.emitScalar(value.jasmineToString());
      } else if (typeof value === 'string') {
        this.emitString(value);
      } else if (j$.isSpy(value)) {
        // From Jasmine 3.0 "identity" is a string, not a function.
        // https://github.com/mradionov/karma-jasmine-diff-reporter/pull/35
        var identity = value.and.identity;

        this.emitScalar('spy on ' + (typeof identity === 'string' ? identity : value.and.identity() /* keep context of function same */));
      } else if (value instanceof RegExp) {
        this.emitScalar(value.toString());
      } else if (typeof value === 'function') {
        this.emitScalar('Function');
      } else if (typeof value.nodeType === 'number') {
        this.emitScalar('HTMLNode');
      } else if (value instanceof Date) {
        this.emitScalar('Date(' + value + ')');
      } else if (j$.util.arrayContains(this.seen, value)) {
        this.emitScalar('<circular reference: ' + (j$.isArray_(value) ? 'Array' : 'Object') + '>');
      } else if (j$.isArray_(value) || j$.isA_('Object', value)) {
        this.seen.push(value);
        if (j$.isArray_(value)) {
          this.emitArray(value);
        } else {
          this.emitObject(value);
        }
        this.seen.pop();
      } else {
        this.emitScalar(value.toString());
      }
    } finally {
      this.ppNestLevel_--;
    }
  };

  PrettyPrinter.prototype.iterateObject = function(obj, fn) {
    for (var property in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, property)) { continue; }
      fn(property, obj.__lookupGetter__ ? (!j$.util.isUndefined(obj.__lookupGetter__(property)) &&
          obj.__lookupGetter__(property) !== null) : false);
    }
  };

  PrettyPrinter.prototype.emitArray = j$.unimplementedMethod_;
  PrettyPrinter.prototype.emitObject = j$.unimplementedMethod_;
  PrettyPrinter.prototype.emitScalar = j$.unimplementedMethod_;
  PrettyPrinter.prototype.emitString = j$.unimplementedMethod_;

  function StringPrettyPrinter() {
    PrettyPrinter.call(this);

    this.string = '';
  }

  j$.util.inherit(StringPrettyPrinter, PrettyPrinter);

  StringPrettyPrinter.prototype.emitScalar = function(value) {
    this.append(value);
  };

  StringPrettyPrinter.prototype.emitString = function(value) {
    this.append(markString(value));
    // this.append('\'' + value + '\'');
  };

  StringPrettyPrinter.prototype.emitArray = function(array) {
    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
      this.append('Array');
      return;
    }
    var length = Math.min(array.length, j$.MAX_PRETTY_PRINT_ARRAY_LENGTH);
    this.append('[ ');
    for (var i = 0; i < length; i++) {
      if (i > 0) {
        this.append(', ');
      }
      this.format(array[i]);
    }
    if(array.length > length){
      this.append(', ...');
    }

    var self = this;
    var first = array.length === 0;
    this.iterateObject(array, function(property, isGetter) {
      if (property.match(/^\d+$/)) {
        return;
      }

      if (first) {
        first = false;
      } else {
        self.append(', ');
      }

      self.formatProperty(array, property, isGetter);
    });

    this.append(' ]');
  };

  StringPrettyPrinter.prototype.emitObject = function(obj) {
    var constructorName = obj.constructor ? j$.fnNameFor(obj.constructor) : 'null';
    this.append(constructorName);

    if (this.ppNestLevel_ > j$.MAX_PRETTY_PRINT_DEPTH) {
      return;
    }

    var self = this;
    this.append('({ ');
    var first = true;

    var sortedObj = sortObject(obj);

    this.iterateObject(sortedObj, function(property, isGetter) {
      if (first) {
        first = false;
      } else {
        self.append(', ');
      }

      self.formatProperty(sortedObj, property, isGetter);
    });

    this.append(' })');
  };

  StringPrettyPrinter.prototype.formatProperty = function(obj, property, isGetter) {
      this.append(property);
      this.append(': ');
      if (isGetter) {
        this.append('<getter>');
      } else {
        this.format(obj[property]);
      }
  };

  StringPrettyPrinter.prototype.append = function(value) {
    this.string += value;
  };

  return function(value) {
    var stringPrettyPrinter = new StringPrettyPrinter();
    stringPrettyPrinter.format(value);
    return stringPrettyPrinter.string;
  };
}

}(window));
