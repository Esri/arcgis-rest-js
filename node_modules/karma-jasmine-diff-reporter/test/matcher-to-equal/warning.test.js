'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: warning:');

test('functions',

  'Expected Function to equal Function.',

  'Expected <w>Function</w> to equal <w>Function</w>.'
);

test('functions in objects',

  'Expected Object({ foo: Function }) ' +
  'to equal Object({ foo: Function }).',

  'Expected Object({ foo: <w>Function</w> }) ' +
  'to equal Object({ foo: <w>Function</w> }).'
);


// jasmine.MAX_PRETTY_PRINT_ARRAY_LENGTH = 2
test('max array length',

  'Expected [ 1, 2, ... ] to equal [ 1, 3, ... ].',

  'Expected [ 1, <a>2</a>, <w>...</w> ] to equal [ 1, <e>3</e>, <w>...</w> ].'
);

// jasmine.MAX_PRETTY_PRINT_DEPTH = 1
test('max nest level',

  'Expected [ 1, Array, 3 ] to equal [ 1, Array, 4 ].',

  'Expected [ 1, <w>Array</w>, <a>3</a> ] to equal [ 1, <w>Array</w>, <e>4</e> ].'
);

test('global',

  'Expected [ 1, <global> ] to equal [ 2, <global> ].',

  'Expected [ <a>1</a>, <w><global></w> ] to equal [ <e>2</e>, <w><global></w> ].'
);

test('nodes',

  'Expected [ 1, HTMLNode ] to equal [ 2, HTMLNode ].',

  'Expected [ <a>1</a>, <w>HTMLNode</w> ] to equal [ <e>2</e>, <w>HTMLNode</w> ].'
);

test('circular reference',

  'Expected [ 1, <circular reference: Array>, 3 ] ' +
  'to equal [ 1, <circular reference: Object>, 4 ].',

  'Expected [ 1, <w><circular reference: Array></w>, <a>3</a> ] ' +
  'to equal [ 1, <w><circular reference: Object></w>, <e>4</e> ].'
);
