'use strict';

var tape = require('tape');

var format = require('../../src/format');
var createHighlighter = require('./test-highlighter');
var stack = require('./stack');

function wrapTape(tapeFn, namespace) {
  return function test(name, input, expected, options) {
    options = options || {};
    options.stack = options.stack || stack;
    options.format = options.format || {};
    options.highlighter = options.highlighter || {};

    var highlighter = createHighlighter(options.highlighter);

    return tapeFn(namespace + ' ' + name,  function testBody(assert) {
      var out = format(input + stack, highlighter, options.format);

      assert.equal(out, expected + stack);
      assert.end();
    });
  };
}

module.exports = function createTestFn(namespace) {
  var test = wrapTape(tape, namespace);
  test.only = wrapTape(tape.only, namespace);
  return test;
};
