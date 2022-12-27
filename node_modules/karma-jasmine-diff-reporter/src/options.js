'use strict';

var objectUtils = require('./utils/object');
var defaults = objectUtils.defaults;
var langUtils = require('./utils/lang');
var isNumber = langUtils.isNumber;
var isObject = langUtils.isObject;
var stringUtils = require('./utils/string');
var times = stringUtils.times;


function processPretty(options) {
  if (!options.pretty) return false;

  // 2 spaces by default
  var indent = options.pretty === true ? 2 : options.pretty;

  if (isNumber(indent)) {
    indent = times(' ', indent);
  }

  return indent;
}

function processMultiline(options) {
  if (!options.multiline) return false;

  // By default:
  // - one line between text and values both before and after
  // - two spaced of indentation from the side for values
  var multiline = {
    before: 2,
    after: 2,
    indent: 2
  };

  if (isObject(options.multiline)) {
    multiline = defaults(options.multiline, multiline);
  }

  if (isNumber(multiline.indent)) {
    multiline.indent = times(' ', multiline.indent);
  }

  if (isNumber(multiline.before)) {
    multiline.before = times('\n', multiline.before);
  }

  if (isNumber(multiline.after)) {
    multiline.after = times('\n', multiline.after);
  }

  return multiline;
}

function processVerbose(options) {
  if (options.verbose === false) {
    return {
      object: false
    };
  }

  // By default - equal to Jasmine output
  var verbose = {
    object: true
  };

  if (isObject(options.verbose)) {
    verbose = defaults(options.verbose, verbose);
  }

  return verbose;
}

function processOptions(options) {
  options = options || {};

  // Becomes a string, which should be used as indentation level
  // Or "false", if turned off
  options.pretty = processPretty(options);

  // Becomes an object with "before", "after" and "indent" props
  // Or "false", if turned off
  options.multiline = processMultiline(options);

  // Always becomes an object with "object" prop
  options.verbose = processVerbose(options);

  return options;
}

module.exports = processOptions;
