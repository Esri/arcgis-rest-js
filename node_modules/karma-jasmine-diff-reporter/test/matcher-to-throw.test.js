'use strict';

var createTest = require('./helpers/test');

var test = createTest('format: toThrow:');

test('without message',

  'Expected function to throw' +
  ' TypeError: foo,' +
  ' but it threw' +
  ' ReferenceError: a is not defined.',

  'Expected function to throw' +
  ' <e>TypeError</e>: <e>foo</e>,' +
  ' but it threw' +
  ' <a>ReferenceError</a>: <a>a is not defined</a>.'
);

test('with message',

  'Expected function to throw' +
  " TypeError with message 'foo'," +
  ' but it threw' +
  " ReferenceError with message 'bar'.",

  'Expected function to throw' +
  " <e>TypeError</e> with message '<e>foo</e>'," +
  ' but it threw' +
  " <a>ReferenceError</a> with message '<a>bar</a>'."
);
