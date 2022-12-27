'use strict';

var createTest = require('../helpers/test');
var m = require('../helpers/mark');

var test = createTest('format: toEqual: array:');

test(
  'wrong value',

  'Expected [ 1, 2, 3 ] to equal [ 1, 4, 3 ].',

  'Expected [ 1, <a>2</a>, 3 ] ' +
  'to equal [ 1, <e>4</e>, 3 ].'
);

test('with object with wrong value',

  'Expected [ 1, Object({ foo: 42 }), 3 ] ' +
  'to equal [ 1, Object({ foo: 43 }), 3 ].',

  'Expected [ 1, Object({ foo: <a>42</a> }), 3 ] ' +
  'to equal [ 1, Object({ foo: <e>43</e> }), 3 ].'
);

test('nested array',

  'Expected [ 1, [ 2, [ 3, 4 ] ] ] ' +
  'to equal [ 1, [ 5, [ 7, 4 ] ] ].',

  'Expected [ 1, [ <a>2</a>, [ <a>3</a>, 4 ] ] ] ' +
  'to equal [ 1, [ <e>5</e>, [ <e>7</e>, 4 ] ] ].'
);

test('string in nested array',

  'Expected [ 1, [ ' + m('foo') + ' ], 2, ' + m('bar') + ' ] ' +
  'to equal [ 1, [ ' + m('qux') + ' ], 3, ' + m('bar') + ' ].',

  "Expected [ 1, [ <a>'foo'</a> ], <a>2</a>, 'bar' ] " +
  "to equal [ 1, [ <e>'qux'</e> ], <e>3</e>, 'bar' ]."
);

test('value missing in the middle',

  'Expected [ 1, 2, 3, 4, 5, 6 ] to equal [ 1, 2, 3, 5, 6 ].',

  'Expected [ 1, 2, 3, <a>4</a>, <a>5</a>, <a>6</a> ] ' +
  'to equal [ 1, 2, 3, <e>5</e>, <e>6</e> ].'
);

test('values swapped',

  'Expected [ 1, 2, 3, 4 ] to equal [ 1, 3, 2, 4].',

  'Expected [ 1, <a>2</a>, <a>3</a>, 4 ] ' +
  'to equal [ 1, <e>3</e>, <e>2</e>, 4 ].'
);

test('different first value',

  'Expected [ 1, 2, 3 ] to equal [ 4, 2, 3 ].',

  'Expected [ <a>1</a>, 2, 3 ] to equal [ <e>4</e>, 2, 3 ].'
);

test('empty array',
  'Expected [  ] to equal [ 1 ].',
  'Expected [  ] to equal [ <e>1</e> ].'
);
