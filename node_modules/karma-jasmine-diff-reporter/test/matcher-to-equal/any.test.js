'use strict';

var createTest = require('../helpers/test');
var m = require('../helpers/mark');

var test = createTest('format: toEqual: any:');

test('number vs any string',

  'Expected 3 to equal <jasmine.any(String)>.',

  'Expected <a>3</a> to equal <e><jasmine.any(String)></e>.'
);

test('any string vs number',

  'Expected <jasmine.any(String)> to equal 3.',

  'Expected <a><jasmine.any(String)></a> to equal <e>3</e>.'
);

test('number vs any date',

  'Expected 4 to equal <jasmine.any(Date)>.',

  'Expected <a>4</a> to equal <e><jasmine.any(Date)></e>.'
);

test('any number vs date',

  'Expected <jasmine.any(Number)> ' +
  'to equal Date(Wed Jan 25 2017 22:26:56 GMT+0300 (+03)).',

  'Expected <a><jasmine.any(Number)></a> ' +
  'to equal <e>Date(Wed Jan 25 2017 22:26:56 GMT+0300 (+03))</e>.'
);

test('any number vs any string',

  'Expected <jasmine.any(Number)> to equal <jasmine.any(String)>.',

  'Expected <a><jasmine.any(Number)></a> to equal <e><jasmine.any(String)></e>.'
);

test('object with string vs any string',

  'Expected Object({ foo: 42, bar: ' + m('bar') + ' }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.any(String)> }).',

  "Expected Object({ foo: <a>42</a>, bar: 'bar' }) " +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.any(String)> }).'
);

test('object with number vs any number',

  'Expected Object({ foo: 42, bar: 53 }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.any(Number)> }).',

  'Expected Object({ foo: <a>42</a>, bar: 53 }) ' +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Number)> }).'
);

test('object with boolean vs any boolean',

  'Expected Object({ foo: 42, bar: true }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.any(Boolean)> }).',

  'Expected Object({ foo: <a>42</a>, bar: true }) ' +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Boolean)> }).'
);

test('object with object vs any object',

  'Expected Object({ foo: 42, bar: Object({ baz: 53 }) }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.any(Object)> }).',

  'Expected Object({ foo: <a>42</a>, bar: Object({ baz: 53 }) }) ' +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Object)> }).'
);

test('object with function vs any function',

  'Expected Object({ foo: 42, bar: Function }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.any(Function)> }).',

  'Expected Object({ foo: <a>42</a>, bar: Function }) ' +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Function)> }).'
);

test('array with number vs any string',

  'Expected [ 1, 2, 3 ] to equal [ 1, <jasmine.any(String)>, 3 ].',

  'Expected [ 1, <a>2</a>, 3 ] to equal [ 1, <e><jasmine.any(String)></e>, 3 ].'
);

test('object with instance vs any instance',

  'Expected Object({ foo: 42, bar: Foo({ baz: 53 }) }) ' +
  'to equal Object({ foo: 43, bar: <jasmine.any(Foo)> }).',

  'Expected Object({ foo: <a>42</a>, bar: Foo({ baz: 53 }) }) ' +
  'to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Foo)> }).'
);
