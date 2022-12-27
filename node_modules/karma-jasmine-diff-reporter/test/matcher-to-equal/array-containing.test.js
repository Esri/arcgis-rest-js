'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: array containing:');

test('missing value',

  'Expected [ 1, 2, 3 ] ' +
  'to equal <jasmine.arrayContaining([ 4 ])>.',

  'Expected [ 1, 2, 3 ] ' +
  'to equal <jasmine.arrayContaining([ <e>4</e> ])>.'
);

test('missing and existing values',

  'Expected [ 1, 2, 3, 4 ] ' +
  'to equal <jasmine.arrayContaining([ 2, 5, 4, 8 ])>.',

  'Expected [ 1, 2, 3, 4 ] ' +
  'to equal <jasmine.arrayContaining([ 2, <e>5</e>, 4, <e>8</e> ])>.'
);

test('nested second level and missing value',

  'Expected [ 1, [ 2, 3 ], 4 ] ' +
  'to equal [ 1, <jasmine.arrayContaining([ 3, 5 ])>, 4 ].',

  'Expected [ 1, [ 2, 3 ], 4 ] ' +
  'to equal [ 1, <jasmine.arrayContaining([ 3, <e>5</e> ])>, 4 ].'
);

test('with object with wrong value',

  'Expected [ 1, Object({ foo: 42 }), 3 ] ' +
  'to equal [ 1, Object({ foo: 43 }), 3 ].',

  'Expected [ 1, Object({ foo: <a>42</a> }), 3 ] ' +
  'to equal [ 1, Object({ foo: <e>43</e> }), 3 ].'
);

test('with object with wrong value',

  'Expected [ 1, Object({ foo: 42 }), 3 ] ' +
  'to equal <jasmine.arrayContaining([ Object({ foo: 43 }) ])>.',

  'Expected [ 1, Object({ foo: 42 }), 3 ] ' +
  'to equal <jasmine.arrayContaining([ <e>Object({ foo: 43 })</e> ])>.'
);
