'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: anything:');

test('object with number vs anything',

  'Expected Object({ foo: 42, bar: 53 }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.anything> }).',

  'Expected Object({ foo: <a>42</a>, bar: 53 }) ' +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.anything> }).'
);
