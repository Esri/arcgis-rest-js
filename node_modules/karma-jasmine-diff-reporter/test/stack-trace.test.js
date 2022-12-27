'use strict';

var createTest = require('./helpers/test');

var test = createTest('stacktrace:');

// Issue #10 with Phantom JS
test('don\'t capture stacktrace without "at"',

  'Expected true to be false.',

  'Expected <a>true</a> to be <e>false</e>.',

  { stack: '\ncheck@/path/to/file.js:42:0' }
);
