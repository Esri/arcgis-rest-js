var createTest = require('./helpers/test');

var test = createTest('exclusions:');

test('unmatched message',

  'Some random text',

  'Some random text'
);

test('no diff for equal numbers',

  'Expected 5 not to be 5.',

  'Expected 5 not to be 5.'
);
