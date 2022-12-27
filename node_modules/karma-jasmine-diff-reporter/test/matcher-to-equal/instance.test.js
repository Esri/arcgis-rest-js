'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: instances:');


test(
  'with different props keys',

  'Expected Foo({ bar: 42 }) to equal Foo({ foo: 42 }).',

  'Expected Foo({ <a>bar: 42</a> }) to equal Foo({ <e>foo: 42</e> }).'
);

test(
  'of different classes',

  'Expected Foo({ bar: 42 }) to equal Bar({ foo: 42 }).',

  'Expected <a>Foo({ bar: 42 })</a> to equal <e>Bar({ foo: 42 })</e>.'
);

test(
  'nested',

  'Expected Foo({ bar: Bar({ qux: 42 }) }) ' +
  'to equal Foo({ bar: Bar({ xuq: 42 }) }).',

  'Expected Foo({ bar: Bar({ <a>qux: 42</a> }) }) ' +
  'to equal Foo({ bar: Bar({ <e>xuq: 42</e> }) }).'
);

test(
  'nested with diffrerent keys',

  'Expected Foo({ bar: Bar({ qux: 42 }) }) ' +
  'to equal Foo({ baz: Bar({ qux: 42 }) }).',

  'Expected Foo({ <a>bar: Bar({ qux: 42 })</a> }) ' +
  'to equal Foo({ <e>baz: Bar({ qux: 42 })</e> }).'
);
