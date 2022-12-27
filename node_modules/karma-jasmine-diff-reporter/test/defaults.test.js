'use strict';

var createTest = require('./helpers/test');

var test = createTest('defaults:');

test('different types',

  'Expected true to be 5.',

  'Expected <d><a>true</a></d> to be <d><e>5</e></d>.',

  { highlighter: { defaults: true } }
);

test('primitives',

  'Expected 42 to be 43.',

  'Expected <d><a>42</a></d> to be <d><e>43</e></d>.',

  { highlighter: { defaults: true } }
);

test('no diff for equal numbers',

  'Expected 5 not to be 5.',

  'Expected <d>5</d> not to be <d>5</d>.',

  { highlighter: { defaults: true } }
);

test('warnings, matcher toBe',

  'Expected [ 1, 2 ] to be [ 1, 2 ].',

  'Expected <d><w>[ 1, 2 ]</w></d> to be <d><w>[ 1, 2 ]</w></d>.',

  { highlighter: { defaults: true } }
);

test('warnings, matcher toEqual',

  'Expected Function to be Function.',

  'Expected <d><w>Function</w></d> to be <d><w>Function</w></d>.',

  { highlighter: { defaults: true } }
);

test('objects',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected <d>Object({ <a>foo: 42</a> })</d> ' +
  'to equal <d>Object({ <e>bar: 43</e> })</d>.',

  { highlighter: { defaults: true } }
);

test('multiline primitives',

  'Expected 42 to be false.',

  'Expected\n\n' +
  '  <d><a>42</a></d>\n\n' +
  'to be\n\n' +
  '  <d><e>false</e></d>\n\n' +
  '.',

  {
    highlighter: { defaults: true },
    format: { multiline: true }
  }
);

test('multiline pretty arrays',

  'Expected [ 1, 2, 3 ] to equal [ 1, 4, 5 ].',

  'Expected\n\n' +
  '  <d>[\n' +
  '    1,\n' +
  '    <a>2</a>,\n' +
  '    <a>3</a>\n' +
  '  ]</d>\n\n' +
  'to equal\n\n' +
  '  <d>[\n' +
  '    1,\n' +
  '    <e>4</e>,\n' +
  '    <e>5</e>\n' +
  '  ]</d>\n\n' +
  '.',

  {
    highlighter: { defaults: true },
    format: { multiline: true, pretty: true }
  }
);
