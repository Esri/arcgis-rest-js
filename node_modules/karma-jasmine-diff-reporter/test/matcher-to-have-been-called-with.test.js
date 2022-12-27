'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('format: toHaveBeenCalledWith:');

test('bools',

  'Expected spy foo to have been called with [ false ]' +
  ' but actual calls were [ true ].',

  'Expected spy foo to have been called with [ <e>false</e> ]' +
  ' but actual calls were [ <a>true</a> ].'
);

test('objects with different props',

  'Expected spy foo to have been called with ' +
  '[ Object({ foo: ' + m('bar') + ' }) ] ' +
  'but actual calls were ' +
  '[ Object({ baz: ' + m('qux') + ' }) ].',

  'Expected spy foo to have been called with ' +
  "[ Object({ <e>foo: 'bar'</e> }) ] " +
  'but actual calls were ' +
  "[ Object({ <a>baz: 'qux'</a> }) ]."
);

// Jasmine outputs all args for multiple calls in multiple arrays
// https://github.com/jasmine/jasmine/issues/228
test('multiple calls',

  'Expected spy foo to have been called with [ 1, 2 ] ' +
  'but actual calls were [ 4, 2 ], [ 1, 3 ].',

  'Expected spy foo to have been called with [ 1, 2 ] ' +
  'but actual calls were [ <a>4</a>, 2 ], [ 1, <a>3</a> ].'
);
