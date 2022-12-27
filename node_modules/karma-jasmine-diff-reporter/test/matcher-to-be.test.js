'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('format: toBe:');

test('booleans',

  'Expected true to be false.',

  'Expected <a>true</a> to be <e>false</e>.'
);

test('strings',

  'Expected ' + m('foo') + ' to be ' + m('bar') + '.',

  "Expected '<a>foo</a>' to be '<e>bar</e>'."
);

test('strings content',

  'Expected ' + m('I hate cats') + ' to be ' + m('I love cats') + '.',

  "Expected 'I <a>hate</a> cats' " +
  "to be 'I <e>love</e> cats'."
);

test('strings with dots',

  'Expected ' + m('foo. bar. baz.') + ' to be ' + m('qux. bar. daz.') + '.',

  "Expected '<a>foo</a>. bar. <a>baz</a>.' " +
  "to be '<e>qux</e>. bar. <e>daz</e>.'."
);

test('undefined facing a string',

  'Expected ' + m('defined') + ' to be undefined.',

  "Expected <a>'defined'</a> to be <e>undefined</e>."
);

test('defined',

  'Expected undefined to be defined.',

  'Expected <a>undefined</a> to be <e>defined</e>.'
);

test('truthy',

  'Expected false to be truthy.',

  'Expected <a>false</a> to be <e>truthy</e>.'
);

test('falsy',

  'Expected true to be falsy.',

  'Expected <a>true</a> to be <e>falsy</e>.'
);

test('close to',

  'Expected 3 to be close to 5.',

  'Expected <a>3</a> to be ' +
  '<e>close to 5</e>.'
);

test('greater than',

  'Expected 3 to be greater than 5.',

  'Expected <a>3</a> to be ' +
  '<e>greater than 5</e>.'
);

test('less than',

  'Expected 5 to be less than 3.',

  'Expected <a>5</a> to be ' +
  '<e>less than 3</e>.'
);

test('objects by ref',

  'Expected Object({ foo: 42 }) to be Object({ foo: 42 }).',

  'Expected <w>Object({ foo: 42 })</w> ' +
  'to be <w>Object({ foo: 42 })</w>.'
);

test('arrays by ref',

  'Expected [ 1, 2, 3 ] to be [ 1, 2, 3 ].',

  'Expected <w>[ 1, 2, 3 ]</w> to be <w>[ 1, 2, 3 ]</w>.'

);

test('functions by ref',

  'Expected Function to be Function.',

  'Expected <w>Function</w> to be <w>Function</w>.'
);

test('no diff for equal booleans',

  'Expected true not to be true.',

  'Expected true not to be true.'
);
