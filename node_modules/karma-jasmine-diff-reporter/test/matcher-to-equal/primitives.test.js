'use strict';

var createTest = require('../helpers/test');
var m = require('../helpers/mark');

var test = createTest('format: toEqual: primitives:');

test(
  'booleans',

  'Expected true to equal false.',

  'Expected <a>true</a> to equal <e>false</e>.'
);

test('strings',

  'Expected ' + m('foo') + ' to equal ' + m('bar') + '.',

  "Expected '<a>foo</a>' to equal '<e>bar</e>'."
);
