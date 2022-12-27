'use strict';

var chalk = require('chalk');

// Use "\x1B[K" to clear the line backgorund color
// because there might be some colored whitespace if terminal scrolls the view
var CLEAR_COLOR = '\x1B[K';


function getOwnProperty(object, prop, defaultValue) {
  return object.hasOwnProperty(prop) ? object[prop] : defaultValue;
}


function createColorHighlighter(options) {
  options = options || {};

  function addStyles(string, styles) {
    if (!options.enabled) {
      return chalk.inverse(string);
    }

    var out = string;
    (styles || []).forEach(function (style) {
      if (style) {
        out = chalk[style](out);
      }
    });

    out += CLEAR_COLOR;

    return out;
  }


  function actualText(string) {
    var styles = [
      getOwnProperty(options, 'actualBg', 'bgGreen'),
      getOwnProperty(options, 'actualFg', 'white')
    ];
    return addStyles(string, styles);
  }

  function actualWhitespace(string) {
    var styles = [
      getOwnProperty(options, 'actualWhitespaceBg', 'bgGreen')
    ];
    return addStyles(string, styles);
  }

  function actual(string) {
    return string
      .replace(/\S+/g, actualText)
      .replace(/\s+/g, actualWhitespace);
  }


  function expectedText(string) {
    var styles = [
      getOwnProperty(options, 'expectedBg', 'bgRed'),
      getOwnProperty(options, 'expectedFg', 'white')
    ];
    return addStyles(string, styles);
  }

  function expectedWhitespace(string) {
    var styles = [
      getOwnProperty(options, 'expectedWhitespaceBg', 'bgRed')
    ];
    return addStyles(string, styles);
  }

  function expected(string) {
    return string
      .replace(/\S+/g, expectedText)
      .replace(/\s+/g, expectedWhitespace);
  }


  function warningText(string) {
    var styles = [
      getOwnProperty(options, 'warningBg', 'bgYellow'),
      getOwnProperty(options, 'warningFg', 'white')
    ];
    return addStyles(string, styles);
  }

  function warningWhitespace(string) {
    var styles = [
      getOwnProperty(options, 'warningWhitespaceBg', 'bgYellow')
    ];
    return addStyles(string, styles);
  }

  function warning(string) {
    return string
      .replace(/\S+/g, warningText)
      .replace(/\s+/g, warningWhitespace);
  }


  function defaults(string) {
    var styles = [
      options.defaultFg,
      options.defaultBg
    ];
    return addStyles(string, styles);
  }


  function silent(string) {
    return string;
  }


  return {
    actual: actual,
    expected: expected,
    defaults: defaults,
    warning: warning,
    silent: silent
  };
}

module.exports = createColorHighlighter;
