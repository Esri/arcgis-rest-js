'use strict';

var createTest = require('./helpers/test');

var test = createTest('format: custom:');

test('default order',

  'Expected true to look the same as false.',

  'Expected <e>true</e> to look the same as <a>false</a>.',

  { format: { matchers: {
    toLookTheSameAS: {
      pattern: /Expected ([\S\s]*?) to look the same as ([\S\s]*?)\./
    }
  }}}
);

test('reverse order',

  'Expected true to look the same as false.',

  'Expected <a>true</a> to look the same as <e>false</e>.',

  { format: { matchers: {
    toLookTheSameAs: {
      pattern: /Expected ([\S\s]*?) to look the same as ([\S\s]*?)\./,
      reverse: true
    }
  }}}
);

test('custom format as string',

  "Expected 'foo bar' to contain 'baz'.",

  "Expected '<a>foo bar</a>' to contain '<e>baz</e>'.",

  { format: { matchers: {
    toContain: {
      format: 'primitive',
      pattern: /Expected ([\S\s]*?) to contain ([\S\s]*?)\./,
      reverse: true
    }
  }}}
);

test('custom format as unknown string defaults to complex diff',

  "Expected 'foo bar' to contain 'baz'.",

  "Expected <a>'foo bar'</a> to contain <e>'baz'</e>.",

  { format: { matchers: {
    toContain: {
      format: 'foo',
      pattern: /Expected ([\S\s]*?) to contain ([\S\s]*?)\./,
      reverse: true
    }
  }}}
);

test('custom format as invalid value defaults to complex diff',

  "Expected 'foo bar' to contain 'baz'.",

  "Expected <a>'foo bar'</a> to contain <e>'baz'</e>.",

  { format: { matchers: {
    toContain: {
      format: 1,
      pattern: /Expected ([\S\s]*?) to contain ([\S\s]*?)\./,
      reverse: true
    }
  }}}
);

test('custom format as function',

  "Expected 'foo bar' to contain 'baz'.",

  "Expected '<a>foo bar</a>' to contain '<e>baz</e>'.",

  { format: { matchers: {
    toContain: {
      format: function (diff, expectedValue, actualValue, highlighter, options) {
        return diff.primitive(expectedValue, actualValue, highlighter, options);
      },
      pattern: /Expected ([\S\s]*?) to contain ([\S\s]*?)\./,
      reverse: true
    }
  }}}
);
