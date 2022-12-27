'use strict';

var createTest = require('./helpers/test');

var test = createTest('multiline:');

test('primitives, matcher toBe',

  'Expected true to be false.',

  'Expected\n' +
  '\n' +
  '  <a>true</a>\n' +
  '\n' +
  'to be\n' +
  '\n' +
  '  <e>false</e>\n' +
  '\n' +
  '.',

  { format: { multiline: true } }
);

test('different types, matcher toBe',

  'Expected true to be 42.',

  'Expected\n' +
  '\n' +
  '  <a>true</a>\n' +
  '\n' +
  'to be\n' +
  '\n' +
  '  <e>42</e>\n' +
  '\n' +
  '.',

  { format: { multiline: true } }
);

test('arrays, matcher toBe',

  'Expected [ 1, 2, 3 ] to be [ 1, 4, 3 ].',

  'Expected\n' +
  '\n' +
  '  <w>[ 1, 2, 3 ]</w>\n' +
  '\n' +
  'to be\n' +
  '\n' +
  '  <w>[ 1, 4, 3 ]</w>\n' +
  '\n' +
  '.',

  { format: { multiline: true } }
);

test('matcher toThrow',

  'Expected function to throw' +
  ' TypeError: foo,' +
  ' but it threw' +
  ' ReferenceError: a is not defined.',

  'Expected function to throw\n' +
  '\n' +
  '  <e>TypeError</e>: <e>foo</e>\n' +
  '\n' +
  'but it threw\n' +
  '\n' +
  '  <a>ReferenceError</a>: <a>a is not defined</a>\n' +
  '\n' +
  '.',

  { format: { multiline: true } }
);

test('matcher toHaveBeenCalledWith',

  'Expected spy foo to have been called with [ false ]' +
  ' but actual calls were [ true ].',

  'Expected spy foo to have been called with\n' +
  '\n' +
  '  [ <e>false</e> ]\n' +
  '\n' +
  'but actual calls were\n' +
  '\n' +
  '  [ <a>true</a> ]\n' +
  '\n' +
  '.',

  { format: { multiline: true } }
);

test('before, after, indent int',

  'Expected true to be false.',

  'Expected\n' +
  '    <a>true</a>\n' +
  '\n' +
  '\n' +
  'to be\n' +
  '    <e>false</e>\n' +
  '\n' +
  '\n' +
  '.',

  { format: { multiline: {
    before: 1,
    after: 3,
    indent: 4
  }}}
);

test('indent string',

  'Expected true to be false.',

  'Expected\n' +
  '\n' +
  '\t<a>true</a>\n' +
  '\n' +
  'to be\n' +
  '\n' +
  '\t<e>false</e>\n' +
  '\n' +
  '.',

  { format: { multiline: {
    indent: '\t'
  }}}
);

test('before after string',

  'Expected true to be false.',

  'Expected--^^<a>true</a>__to be--^^<e>false</e>__.',

  { format: { multiline: {
    before: '--',
    after: '__',
    indent: '^^'
  }}}
);

test('pretty',

  "Expected [ 5, 'foo', Object({ baz: true }) ] " +
  "to equal [ 10, 'bar', Object({ baz: false }) ].",

  'Expected\n' +
  '\n' +
  '  [\n' +
  '    <a>5</a>,\n' +
  "    <a>'foo'</a>,\n" +
  '    Object({\n' +
  '      baz: <a>true</a>\n' +
  '    })\n' +
  '  ]\n' +
  '\n' +
  'to equal\n' +
  '\n' +
  '  [\n' +
  '    <e>10</e>,\n' +
  "    <e>'bar'</e>,\n" +
  '    Object({\n' +
  '      baz: <e>false</e>\n' +
  '    })\n' +
  '  ]\n' +
  '\n' +
  '.',

  { format: { multiline: true, pretty: true } }
);

test('pretty multiple calls, matcher toHaveBeenCalledWith',

  'Expected spy foo to have been called with [ 1, 2 ] ' +
  'but actual calls were [ 4, 2 ], [ 1, 3 ].',

  'Expected spy foo to have been called with\n\n' +
  '  [\n' +
  '    1,\n' +
  '    2\n' +
  '  ]\n\n' +
  'but actual calls were\n\n' +
  '  [\n' +
  '    <a>4</a>,\n' +
  '    2\n' +
  '  ],\n' +
  '  [\n' +
  '    1,\n' +
  '    <a>3</a>\n' +
  '  ]\n\n' +
  '.',

  { format: { multiline: true, pretty: true } }
);
