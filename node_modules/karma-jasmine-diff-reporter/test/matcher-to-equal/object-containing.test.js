'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: object containing:');

test('wrong value',

  'Expected Object({ foo: 42 }) ' +
  'to equal <jasmine.objectContaining(Object({ foo: 43 }))>.',

  'Expected Object({ foo: <a>42</a> }) ' +
  'to equal <jasmine.objectContaining(Object({ foo: <e>43</e> }))>.'
);

test('different prop',

  'Expected Object({ foo: 42 }) ' +
  'to equal <jasmine.objectContaining(Object({ bar: 42 }))>.',

  'Expected Object({ foo: 42 }) ' +
  'to equal <jasmine.objectContaining(Object({ <e>bar: 42</e> }))>.'
);

test('multiple props containing single prop',

  'Expected Object({ foo: 42, bar: 43 }) ' +
  'to equal <jasmine.objectContaining(Object({ bar: 42 }))>.',

  'Expected Object({ foo: 42, bar: <a>43</a> }) ' +
  'to equal <jasmine.objectContaining(Object({ bar: <e>42</e> }))>.'
);

test('missing prop',

  'Expected Object({ foo: 42 }) ' +
  'to equal <jasmine.objectContaining(Object({ foo: 42, bar: 43 }))>.',

  'Expected Object({ foo: 42 }) ' +
  'to equal <jasmine.objectContaining(Object({ foo: 42, <e>bar: 43</e> }))>.'
);

test('nested second level and wrong value',

  'Expected Object({ foo: Object({ bar: 43 }) }) ' +
  'to equal Object({ foo: <jasmine.objectContaining(Object({ bar: 44 }))> }).',

  'Expected Object({ foo: Object({ bar: <a>43</a> }) }) ' +
  'to equal Object({ foo: <jasmine.objectContaining(Object({ bar: <e>44</e> }))> }).'
);

test('nested containing and wrong value',

  'Expected Object({ foo: Object({ bar: 43 }) }) ' +
  'to equal <jasmine.objectContaining(Object({ ' +
    'foo: <jasmine.objectContaining(Object({ bar: 44 }))> ' +
  '}))>.',

  'Expected Object({ foo: Object({ bar: <a>43</a> }) }) ' +
  'to equal <jasmine.objectContaining(Object({ ' +
    'foo: <jasmine.objectContaining(Object({ bar: <e>44</e> }))> ' +
  '}))>.'
);
