'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: object:');

test('wrong value',

  'Expected Object({ foo: 42 }) to equal Object({ foo: 43 }).',

  'Expected Object({ foo: <a>42</a> }) to equal Object({ foo: <e>43</e> }).'
);

test('different props',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 33 }).',

  'Expected Object({ <a>foo: 42</a> }) to equal Object({ <e>bar: 33</e> }).'
);

test('nested object',

  'Expected Object({ foo: Object({ bar: 42, qux: 43 }) }) ' +
  'to equal Object({ foo: Object({ bar: 33 }) }).',

  'Expected Object({ foo: Object({ bar: <a>42</a>, <a>qux: 43</a> }) }) ' +
  'to equal Object({ foo: Object({ bar: <e>33</e> }) }).'
);

test('value of different type',

  'Expected Object({ foo: 42 }) to equal Object({ foo: true }).',

  'Expected Object({ foo: <a>42</a> }) to equal Object({ foo: <e>true</e> }).'
);

test('missing prop',

  'Expected Object({ foo: 42, bar: 43, qux: 44 }) ' +
  'to equal Object({ foo: 42, qux: 44 }).',

  'Expected Object({ foo: 42, <a>bar: 43</a>, qux: 44 }) ' +
  'to equal Object({ foo: 42, qux: 44 }).'
);

test('any function',

  'Expected Object({ foo: 42, bar: Function }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.any(Function)> }).',

  'Expected Object({ foo: <a>42</a>, bar: Function }) ' +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Function)> }).'
);

test('nested object vs different type',

  'Expected Object({ foo: Object({ bar: 42 }) }) ' +
  'to equal Object({ foo: true }).',

  'Expected Object({ foo: <a>Object({ bar: 42 })</a> }) ' +
  'to equal Object({ foo: <e>true</e> }).'
);

test('keys with dots same',

  'Expected Object({ foo.bar: 42, qux: 43 }) ' +
  'to equal Object({ foo.bar: 42, qux: 44 }).',

  'Expected Object({ foo.bar: 42, qux: <a>43</a> }) ' +
  'to equal Object({ foo.bar: 42, qux: <e>44</e> }).'
);

test('keys with dots different',

  'Expected Object({ foo.bar: 42, foo: 43 }) ' +
  'to equal Object({ foo.baz: 42, foo: 44 }).',

  'Expected Object({ <a>foo.bar: 42</a>, foo: <a>43</a> }) ' +
  'to equal Object({ <e>foo.baz: 42</e>, foo: <e>44</e> }).'
);

test('empty object',
  'Expected Object({  }) to equal Object({ foo: 42 }).',
  'Expected Object({  }) to equal Object({ <e>foo: 42</e> }).'
);
