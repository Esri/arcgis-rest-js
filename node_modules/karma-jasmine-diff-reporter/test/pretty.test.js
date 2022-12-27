'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('pretty:');

test('primitives are the same',

  'Expected 2 to be 5.',

  'Expected <a>2</a> to be <e>5</e>.'
);

test('one-level objects, matcher toBe',

  'Expected Object({ foo: 42 }) to be Object({ foo: 43 }).',

  'Expected <w>Object({ foo: 42 })</w> to be <w>Object({ foo: 43 })</w>.',

  { format: { pretty: true } }
);

test('one-level objects, matcher toEqual',

  'Expected Object({ foo: 42 }) to equal Object({ foo: 43 }).',

  'Expected Object({\n' +
  '  foo: <a>42</a>\n' +
  '}) to equal Object({\n' +
  '  foo: <e>43</e>\n' +
  '}).',

  { format: { pretty: true } }
);

test('one-level objects, matcher toHaveBeenCalledWith',

  'Expected spy foo to have been called with [ ' +
  'Object({ foo: 42 })' +
  '] but actual calls were [ ' +
  'Object({ foo: 43 })' +
  '].',

  'Expected spy foo to have been called with [\n' +
  '  Object({\n' +
  '    foo: <e>42</e>\n' +
  '  })\n' +
  '] but actual calls were [\n' +
  '  Object({\n' +
  '    foo: <a>43</a>\n' +
  '  })\n' +
  '].',

  { format: { pretty: true } }
);

test('two-level objects',

  'Expected Object({ foo: Object({ bar: 42, baz: 43 }), qux: 44 }) ' +
  'to equal Object({ foo: Object({ bar: 45, baz: 43 }), qux: 44 }).',

  'Expected Object({\n' +
  '  foo: Object({\n' +
  '    bar: <a>42</a>,\n' +
  '    baz: 43\n' +
  '  }),\n' +
  '  qux: 44\n' +
  '}) to equal Object({\n' +
  '  foo: Object({\n' +
  '    bar: <e>45</e>,\n' +
  '    baz: 43\n' +
  '  }),\n' +
  '  qux: 44\n' +
  '}).',

  { format: { pretty: true } }
);

test('one-level arrays, matcher toBe',

  'Expected [ 1, 2, 3 ] to be [ 1, 2, 4 ].',

  'Expected <w>[ 1, 2, 3 ]</w> to be <w>[ 1, 2, 4 ]</w>.',

  { format: { pretty: true } }
);

test('one-level arrays, matcher toEqual',

  'Expected [ 1, 2, 3 ] to equal [ 1, 2, 4 ].',

  'Expected [\n' +
  '  1,\n' +
  '  2,\n' +
  '  <a>3</a>\n' +
  '] to equal [\n' +
  '  1,\n' +
  '  2,\n' +
  '  <e>4</e>\n' +
  '].',

  { format: { pretty: true } }
);

test('two-level arrays',

  'Expected [ 1, [ 2, 3 ], 5 ] to equal [ 1, [ 4, 3 ], 5 ].',

  'Expected [\n' +
  '  1,\n' +
  '  [\n' +
  '    <a>2</a>,\n' +
  '    3\n' +
  '  ],\n' +
  '  5\n' +
  '] to equal [\n' +
  '  1,\n' +
  '  [\n' +
  '    <e>4</e>,\n' +
  '    3\n' +
  '  ],\n' +
  '  5\n' +
  '].',

  { format: { pretty: true } }
);

test('array with number, string and obj',

  'Expected [ 5, ' + m('foo') + ', Object({ baz: true }) ] ' +
  'to equal [ 10, ' + m('bar') + ', Object({ baz: false }) ].',

  'Expected [\n' +
  '  <a>5</a>,\n' +
  "  <a>'foo'</a>,\n" +
  '  Object({\n' +
  '    baz: <a>true</a>\n' +
  '  })\n' +
  '] to equal [\n' +
  '  <e>10</e>,\n' +
  "  <e>'bar'</e>,\n" +
  '  Object({\n' +
  '    baz: <e>false</e>\n' +
  '  })\n' +
  '].',

  { format: { pretty: true } }
);

test('tabs as indent',

  'Expected [ 5, ' + m('foo') + ', Object({ baz: true }) ] ' +
  'to equal [ 10, ' + m('bar') + ', Object({ baz: false }) ].',

  'Expected [\n' +
  '\t<a>5</a>,\n' +
  "\t<a>'foo'</a>,\n" +
  '\tObject({\n' +
  '\t\tbaz: <a>true</a>\n' +
  '\t})\n' +
  '] to equal [\n' +
  '\t<e>10</e>,\n' +
  "\t<e>'bar'</e>,\n" +
  '\tObject({\n' +
  '\t\tbaz: <e>false</e>\n' +
  '\t})\n' +
  '].',

  { format: { pretty: '\t' } }
);

test('string as indent',

  'Expected [ 5, ' + m('foo') + ', Object({ baz: true }) ]' +
  ' to equal [ 10, ' + m('bar') + ', Object({ baz: false }) ].',

  'Expected [\n' +
  '---<a>5</a>,\n' +
  "---<a>'foo'</a>,\n" +
  '---Object({\n' +
  '------baz: <a>true</a>\n' +
  '---})\n' +
  '] to equal [\n' +
  '---<e>10</e>,\n' +
  "---<e>'bar'</e>,\n" +
  '---Object({\n' +
  '------baz: <e>false</e>\n' +
  '---})\n' +
  '].',

  { format: { pretty: '---' } }
);

test('pretty: deep object',

  'Expected Object({ foo: ' + m('bar') + ', baz: 5,' +
  " tux: Object({ a: Object({ b: 4, c: [ 'foo', true ] }) }), qux: true })" +
  ' to equal Object({ foo: ' + m('baz') + ', bar: 10,' +
  " tux: Object({ a: Object({ b: 4, c: [ 'foo', false ] }) }), qqx: true }).",

  'Expected Object({\n' +
  "  foo: <a>'bar'</a>,\n" +
  '  <a>baz: 5</a>,\n' +
  '  tux: Object({\n' +
  '    a: Object({\n' +
  '      b: 4,\n' +
  '      c: [\n' +
  "        'foo',\n" +
  '        <a>true</a>\n' +
  '      ]\n' +
  '    })\n' +
  '  }),\n' +
  '  <a>qux: true</a>\n' +
  '}) to equal Object({\n' +
  "  foo: <e>'baz'</e>,\n" +
  '  <e>bar: 10</e>,\n' +
  '  tux: Object({\n' +
  '    a: Object({\n' +
  '      b: 4,\n' +
  '      c: [\n' +
  "        'foo',\n" +
  '        <e>false</e>\n' +
  '      ]\n' +
  '    })\n' +
  '  }),\n' +
  '  <e>qqx: true</e>\n' +
  '}).',

  { format: { pretty: true } }
);

test('dirty object',

  'Expected Object({' +
  ' foo: ' + m("ba', r Object({ ,, []\\") + ',' +
  ' baz: 5, qux: true })' +
  ' to equal Object({' +
  ' foo: ' + m("ba', r \'Object({ ,, []\\") + ',' +
  ' batz: 5, qux: false }).',

  'Expected Object({\n' +
  "  foo: <a>'ba', r Object({ ,, []\\'</a>,\n" +
  '  <a>baz: 5</a>,\n' +
  '  qux: <a>true</a>\n' +
  '}) to equal Object({\n' +
  "  foo: <e>'ba', r 'Object({ ,, []\\'</e>,\n" +
  '  <e>batz: 5</e>,\n' +
  '  qux: <e>false</e>\n' +
  '}).',

  { format: { pretty: true } }
);

test('objects different props',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected Object({\n' +
  '  <a>foo: 42</a>\n' +
  '}) to equal Object({\n' +
  '  <e>bar: 43</e>\n' +
  '}).',

  { format: { pretty: true } }
);

test('object containing missing prop',

  'Expected Object({ foo: 42 }) ' +
  'to equal <jasmine.objectContaining(Object({ bar: 43 }))>.',

  'Expected Object({\n' +
  '  foo: 42\n' +
  '}) to equal <jasmine.objectContaining(Object({\n' +
  '  <e>bar: 43</e>\n' +
  '}))>.',

  { format: { pretty: true } }
);

test('array with missing prop',

  'Expected [ 1, 2, 3 ] to equal [ 1, 2 ].',

  'Expected [\n' +
  '  1,\n' +
  '  2,\n' +
  '  <a>3</a>\n' +
  '] to equal [\n' +
  '  1,\n' +
  '  2\n' +
  '].',

  { format: { pretty: true } }
);

test('array containing wrong value',

  'Expected [ 1, 2, 3 ] to equal <jasmine.arrayContaining([ 4, 2, 5 ])>.',

  'Expected [\n' +
  '  1,\n' +
  '  2,\n' +
  '  3\n' +
  '] to equal <jasmine.arrayContaining([\n' +
  '  <e>4</e>,\n' +
  '  2,\n' +
  '  <e>5</e>\n' +
  '])>.',

  { format: { pretty: true } }
);

test('multiple calls, matcher toHaveBeenCalledWith',

  'Expected spy foo to have been called with [ 1, 2 ] ' +
  'but actual calls were [ 4, 2 ], [ 1, 3 ].',

  'Expected spy foo to have been called with [\n' +
  '  1,\n' +
  '  2\n' +
  '] but actual calls were [\n' +
  '  <a>4</a>,\n' +
  '  2\n' +
  '],\n' +
  '[\n' +
  '  1,\n' +
  '  <a>3</a>\n' +
  '].',

  { format: { pretty: true } }
);

test('empty object',

  'Expected Object({  }) to equal Object({ foo: 42 }).',

  'Expected Object({\n' +
  '\n' +
  '}) to equal Object({\n' +
  '  <e>foo: 42</e>\n' +
  '}).',

  { format: { pretty: true } }
);

test('empty array',

  'Expected [  ] to equal [ 1 ].',

  'Expected [\n' +
  '\n' +
  '] to equal [\n' +
  '  <e>1</e>\n' +
  '].',

  { format: { pretty: true } }
);
