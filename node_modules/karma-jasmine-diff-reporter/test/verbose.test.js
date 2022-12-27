'use strict';

var createTest = require('./helpers/test');

var test = createTest('verbose:');

test('default',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected Object({ <a>foo: 42</a> }) to equal Object({ <e>bar: 43</e> }).'
);

test('objects turned off',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected { <a>foo: 42</a> } to equal { <e>bar: 43</e> }.',

  { format: { verbose: { object: false } } }
);

test('whole turned off',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected { <a>foo: 42</a> } to equal { <e>bar: 43</e> }.',

  { format: { verbose: false } }
);

test('object props facing different type prop',

  'Expected [ 1, 2, 3 ] to equal [ 1, Object({ foo: 42 }), 3 ].',

  'Expected [ 1, <a>2</a>, 3 ] ' +
  'to equal [ 1, <e>{ foo: 42 }</e>, 3 ].',

  { format: { verbose: false } }
);

test('instance props facing different type prop',

  'Expected [ 1, 2, 3 ] to equal [ 1, Foo({ foo: 42 }), 3 ].',

  'Expected [ 1, <a>2</a>, 3 ] ' +
  'to equal [ 1, <e>Foo({ foo: 42 })</e>, 3 ].',

  { format: { verbose: false } }
);
