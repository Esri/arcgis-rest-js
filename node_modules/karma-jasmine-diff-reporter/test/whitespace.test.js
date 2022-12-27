'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('whitespaces:');

test('string with different type of whitespace',

  'Expected ' + m('space space') + ' to be ' + m('space\nspace') + '.',

  "Expected 'space<aw> </aw>space'" +
  " to be 'space<ew>\n</ew>space'.",

  { highlighter: { whitespace: true } }
);

test('string with same kind of whitespace',

  'Expected ' + m('foo. bar. baz.') + ' to be ' + m('qux. bar. daz.') + '.',

  "Expected '<a>foo</a>. bar. <a>baz</a>.' " +
  "to be '<e>qux</e>. bar. <e>daz</e>.'.",

  { highlighter: { whitespace: true } }
);

// It should be tested because of inner logic of splitting stack from message
test('string with whitespace right after dot',

  'Expected ' + m('space. dot') + ' to be ' + m('space.\ndot') + '.',

  "Expected 'space.<aw> </aw>dot'" +
  " to be 'space.<ew>\n</ew>dot'.",

  { highlighter: { whitespace: true } }
);

// Issue #6 not capturing newlines inside strings
test('undefined vs string with newlines',

  'Expected undefined to be ' + m('space\nspace') + '.',

  'Expected <a>undefined</a> to be ' +
  "<e>'space</e><ew>\n</ew><e>space'</e>.",

  { highlighter: { whitespace: true } }
);

test('inside full diffed array',

  'Expected true to equal [ 1, 2 ].',

  'Expected <a>true</a> ' +
  'to equal <e>[</e><ew> </ew><e>1,</e><ew> </ew><e>2</e><ew> </ew><e>]</e>.',

  { highlighter: { whitespace: true } }
);

test('inside full diffed object',

  'Expected true to equal Object({ foo: 42 }).',

  'Expected <a>true</a> ' +
  'to equal <e>Object({</e><ew> </ew><e>foo:</e><ew> </ew><e>42</e><ew> </ew><e>})</e>.',

  { highlighter: { whitespace: true } }
);

test('none for partially diffed array',

  'Expected [ 1, 2, 3 ] to equal [ 1, 4, 5 ].',

  'Expected [ 1, <a>2</a>, <a>3</a> ] to equal [ 1, <e>4</e>, <e>5</e> ].',

  { highlighter: { whitespace: true } }
);

test('inside pretty partially diffed array',

  'Expected [ 1, 2, 3 ] to equal [ 1, 4, 5 ].',

  'Expected [\n' +
  '  1,\n' +
  '  <a>2</a>,\n' +
  '  <a>3</a>\n' +
  '] to equal [\n' +
  '  1,\n' +
  '  <e>4</e>,\n' +
  '  <e>5</e>\n' +
  '].',

  {
    highlighter: { whitespace: true },
    format: { pretty: true }
  }
);
