'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('marker:');

test('clear when processed',

  'Expected ' + m('foo') + ' to be ' + m('bar') + '.',

  "Expected '<a>foo</a>' to be '<e>bar</e>'."
);

test('clear when unknown matcher',

  'Unknown message format ' + m('foo') + ' with marked string.',

  "Unknown message format 'foo' with marked string."
);
