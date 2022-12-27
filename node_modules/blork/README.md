# Blork! Mini runtime type checking in Javascript

[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![GitHub Actions](https://img.shields.io/github/workflow/status/dhoulb/blork/CI/master)](https://github.com/dhoulb/blork/actions)
[![npm](https://img.shields.io/npm/dm/blork.svg)](https://www.npmjs.com/package/blork)

A mini type checker for locking down the external edges of your code. Mainly for use in modules when you don"t know who'll be using the code. Minimal boilerplate code keeps your functions hyper readable and lets them be their beautiful minimal best selves (...or something?)

Blork is fully unit tested and 100% covered (if you're into that!). Heaps of love has been put into the _niceness_ and consistency of error messages, so hopefully you'll enjoy that too.

## Contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
	- [check(): Check individual values](#check-check-individual-values)
	- [add(): Add a custom checker type](#add-add-a-custom-checker-type)
	- [checker(): Return a checker function](#checker-return-a-checker-function)
	- [debug(): Debug any value as a string](#debug-debug-any-value-as-a-string)
	- [ValueError: extensible TypeError for debugging](#valueerror-extensible-typeerror-for-debugging)
- [Reference](#reference)
	- [Type identifiers](#type-identifiers)
	- [Literal types](#literal-types)
	- [Type modifiers](#type-modifiers)
	- [Array type modifier](#array-type-modifier)
	- [Tuple type modifier](#tuple-type-modifier)
	- [Object type modifier](#object-type-modifier)
	- [Optional type modifier](#optional-type-modifier)
	- [Non-empty type modifier](#non-empty-type-modifier)
	- [Size type modifier](#size-type-modifier)
	- [Inverted type modifier](#inverted-type-modifier)
	- [Prefix and return type modifiers](#prefix-and-return-type-modifiers)
	- [OR and AND type modifiers](#or-and-and-type-modifiers)
- [Roadmap and ideas](#roadmap-and-ideas)
- [Contributing](#contributing)
- [Changelog](#changelog)

## Installation

```sh
npm install blork
```

## Basic usage

### check(): Check individual values

The `check()` function allows you to test that individual values correspond to a type, and throw a `TypeError` if not. This is primarily designed for checking function arguments but can be used for any purpose.

`check()` accepts three arguments:

1. `value` The value to check
2. `type` The type to check the value against (full reference list of types is available below)
3. `error` An optional custom error type to throw if the check fails

```js
import { check } from "blork";

// Checks that pass.
check("Sally", "string"); // No error.
check("Sally", String); // No error.

// Checks that fail.
check("Sally", "number"); // Throws ValueError 'Must be number (received "Sally")'
check("Sally", Boolean); // Throws ValueError 'Must be true or false (received "Sally")'

// Checks that fail (with a custom error thrown).
check(123, "str", ReferenceError); // Throws ReferenceError "Must be string (received 123)"
```

`type` will mostly be specified with a type string (a full list of string types is available below) made up of a type identifier (e.g. `integer`) and one or more modifiers (e.g. `str?` which will allow string or undefined, `!num` will allow anything except number, and `bool[]` will allow an array of booleans).

```js
// Optional types.
check(undefined, "number"); // Throws ValueError 'Must be finite number (received undefined)'
check(undefined, "number?"); // No error.

// Note that null does not count as optional.
check(null, "number?"); // Throws ValueError 'Must be finite number (received null)'

// Inverted types.
check(123, "!str"); // No error.
check(123, "!int"); // Throws ValueError 'Must be anything except integer (received 123)'

// Combined OR types.
check(1234, "int | str"); // No error.
check(null, "int | str"); // Throws ValueError 'Must be integer or string (received null)'

// Combined AND types.
check("abc", "string & !falsy"); // No error.
check("", "string & !falsy"); // Throws ValueError 'Must be string and not falsy (received "")'

// Non-empty types.
check("abc", "str+"); // No error.
check("", "str+"); // Throws ValueError 'Must be non-empty string (received "")'

// Size types.
check([1, 2, 3], "arr{2,4}"); // No error.
check([1], "arr{2,3}"); // Throws ValueError 'Must be plain array (minimum 2) (maximum 3) (received [1])'
check([1, 3, 3, 4], "arr{,3}"); // Throws ValueError 'Must be plain array (maximum 3) (received [1])'
check([1, 2], "arr{3,}"); // Throws ValueError 'Must be plain array (minimum 2) (received [1])'

// Array types.
check([1, 2, 3], "num[]"); // No error.
check(["a", "b"], "num[]"); // Throws ValueError 'Must be plain array containing finite number (received ["a", "b"])'

// Tuple types.
check([1, "a"], "[int, str]"); // No error.
check([1, false], "[int, str]"); // Throws ValueError 'Must be plain array tuple like [integer, string] (received [1, false])'

// Object types.
check({ a: 1 }, "{ camel: integer }"); // No error.
check({ "$": 1 }, "{ camel: integer }"); // Throws ValueError 'Must be plain object like { camelCase string: integer } (received { "$": 1 })'

// String literal types.
check("abc", "'abc'"); // No error.
check("def", "'abc'"); // Throws ValueError 'Must be "abc" (received "def")'

// Number literal types.
check(1234, "1234"); // No error.
check(5678, "1234"); // Throws ValueError 'Must be 1234 (received 5678)'

// Return type.
function get123() { return 123; }
check(get123(), "return string"); // Throws ValueError 'Must return string (received 123)'

// Prefix type.
const name = 123;
check(name, "name: string"); // Throws ValueError 'name: Must be string (received 123)'
```

### add(): Add a custom checker type

Register your own checker using the `add()` function. This is great if 1) you're going to be applying the same check over and over, or 2) want to integrate your own checks with Blork's built-in types so your code looks clean.

`add()` accepts three arguments:

1. `name` The name of the custom checker (only kebab-case strings allowed and usually prefixed with a unique identifier).
2. `checker` A Blork type string, or a custom function that accepts a single argument (the value) and returns `true` or `false`.
3. `description` A description of the type of value that's valid. Must fit the phrase `Must be ${description}`, e.g. "positive number" or "unique string". Defaults to the value of the `name` parameter.

```js
import { add, check } from "blork";

// Register a new checker.
add("myapp-dog-name", "str{1,20}", "valid name for a dog");

// Pass.
check("Fido", "myapp-dog-name"); // No error

// Fail.
check("", "myapp-dog-name"); // Throws ValueError 'Must be valid name for a dog (received "")'
```

This example shows using a custom function as a Blork checker:

```js
import { add, check } from "blork";

// Register your new fussy checker.
add(
	// Name of checker.
	"myapp-catty",
	// Checker to validate a string containing "cat".
	(v) => typeof v === "string" && v.strToLower().indexOf("cat") >= 0,
	// Description of what the variable _should_ contain.
	// Gets shown in the error message.
	"string containing 'cat'"
);

// Pass.
check("That cat is having fun", "myapp-catty"); // No error.
check("That CAT is having fun", "myapp-catty"); // No error.

// Fail.
check("A dog sits on the chair", "myapp-catty"); // Throws ValueError 'Must be string containing "cat" (received "A dog sits on the chair")'

// Combine a custom checkers with a built-in checker using `&` syntax.
// The value must pass both checks or an error will be thrown.
// This saves you replicating existing logic in your checker.
check("A CAT SAT ON THE MAT", "upper+ & catty"); // No error.
check("A DOG SAT ON THE MAT", "upper+ & catty"); // Throws ValueError 'Must be non-empty uppercase string and string containing 'cat''
```

### checker(): Return a checker function

Retrieve any Blork checker that can be used elsewhere to check the boolean truthyness of a value.

`checker()` accepts one argument: the type string for the checker function you want to return.

```js
import { checker } from "blork";

// Get a checker function
const isNonEmptyString = checker("str+");

// Use the checker.
isNonEmptyString("abc"); // true
isNonEmptyString(""); // false
isNonEmptyString(84); // false
```

### debug(): Debug any value as a string

Blork exposes its debugger helper function `debug()`, which it uses to format error messages correctly. `debug()` accepts any argument and will return a clear string interpretation of the value.

`debug()` deals well with large and nested objects/arrays by inserting linebreaks and tabs if line length would be unreasonable. Output is also kept cleanish by only debugging 3 levels deep, truncating long strings, and not recursing into circular references.

`debug()` accepts one argument: the value to be debugged as a string.

```js
import { debug } from "blork";

// Debug primitives.
debug(undefined); // Returns `undefined`
debug(null); // Returns `null`
debug(true); // Returns `true`
debug(false); // Returns `false`
debug(123); // Returns `123`
debug("abc"); // Returns `"abc"`
debug(Symbol("abc")); // Returns `Symbol("abc")`

// Debug functions.
debug(function dog() {}); // Returns `dog()`
debug(function() {}); // Returns `anonymous function()`

// Debug objects.
debug({}); // Returns `{}`
debug({ a: 123 }); // Returns `{ "a": 123 }`
debug(new Promise()); // Returns `Promise {}`
debug(new MyClass()); // Returns `MyClass {}`
debug(new class {}()); // Returns `anonymous class {}`
```

### ValueError: extensible TypeError for debugging

Internally, when there's a problem with a value, Blork will throw a `ValueError`. This value extends `TypeError` and standardises error message formats, so errors are consistent and provide the detail a developer should need to debug the issue error quickly and easily.

`new ValueError()` accepts two arguments:

1. `message` The error describing what is wrong with the value, e.g. `"Must be string"`
2. `value` The invalid value so it can appear in the error message, e.g. `(received 123)`

```js
import { ValueError } from "blork";

// Function that checks its argument.
function myFunc(name) {
	// If name isn't a string, throw a ValueError.
	// (This is essentially what check() does behind the scenes.)
	if (typeof name !== "string") throw new ValueError("Must be string", name, "myFunc(): name");
}

// Call with incorrect name.
myFunc(123); // Throws ValueError 'myFunc(): name: Must be a string (received 123)'
```

## Reference

Types are strings made up of a type identifier (e.g. `"promise"` or `"integer"`) possibly combined with a modifier (e.g. `"?"` or `"!"`).

### Type identifiers

This section lists all types identifiers that are built into Blork.

| Type string                      | Description                                                                                                                                   |
|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `primitive`                      | Value is any **primitive** value (undefined, null, booleans, strings, finite numbers)                                                         |
| `null`                           | Value is **null**                                                                                                                             |
| `undefined`, `undef`, `void`     | Value is **undefined**                                                                                                                        |
| `defined`, `def`                 | Value is **not undefined**                                                                                                                    |
| `boolean`, `bool`                | Value is **true** or **false**                                                                                                                |
| `true`                           | Value is **true**                                                                                                                             |
| `false`                          | Value is **false**                                                                                                                            |
| `truthy`                         | Any truthy values (i.e. **== true**)                                                                                                          |
| `falsy`                          | Any falsy values (i.e. **== false**)                                                                                                          |
| `zero`                           | Value is **0**                                                                                                                                |
| `one`                            | Value is **1**                                                                                                                                |
| `nan`                            | Value is **NaN**                                                                                                                              |
| `number`, `num`                  | Any numbers except NaN/Infinity (using **Number.isFinite()**)                                                                                 |
| `+number`, `+num`,               | Numbers more than or equal to zero                                                                                                            |
| `-number`, `-num`                | Numbers less than or equal to zero                                                                                                            |
| `integer`, `int`                 | Integers (using **Number.isInteger()**)                                                                                                       |
| `+integer`, `+int`               | Positive integers including zero                                                                                                              |
| `-integer`, `-int`               | Negative integers including zero                                                                                                              |
| `int8`, `byte`                   | 8-bit integer (-128 to 127)                                                                                                                   |
| `uint8`, `octet`                 | unsigned 8-bit integer (0 to 255)                                                                                                             |
| `int16`, `short`                 | 16-bit integer (-32768 to 32767)                                                                                                              |
| `uint16`, `ushort`               | unsigned 16-bit integer (0 to 65535)                                                                                                          |
| `int32`, `long`                  | 32-bit integer (-2147483648 to 2147483647)                                                                                                    |
| `uint32`, `ulong`                | unsigned 32-bit integer (0 to 4294967295)                                                                                                     |
| `string`, `str`                  | Any strings (using **typeof**)                                                                                                                |
| `alphabetic`                     | alphabetic string (non-empty and alphabetic only)                                                                                             |
| `numeric`                        | numeric strings (non-empty and numerals 0-9 only)                                                                                             |
| `alphanumeric`                   | alphanumeric strings (non-empty and alphanumeric only)                                                                                        |
| `lower`                          | lowercase strings (non-empty and lowercase alphabetic only)                                                                                   |
| `upper`                          | UPPERCASE strings (non-empty and UPPERCASE alphabetic only)                                                                                   |
| `camel`                          | camelCase strings e.g. variable/function names (non-empty alphanumeric with lowercase first letter)                                           |
| `pascal`                         | PascalCase strings e.g. class names (non-empty alphanumeric with uppercase first letter)                                                      |
| `snake`                          | snake_case strings (non-empty alphanumeric lowercase)                                                                                         |
| `screaming`                      | SCREAMING_SNAKE_CASE strings e.g. environment vars (non-empty uppercase alphanumeric)                                                         |
| `kebab`, `slug`                  | kebab-case strings e.g. URL slugs (non-empty alphanumeric lowercase)                                                                          |
| `train`                          | Train-Case strings e.g. HTTP-Headers (non-empty with uppercase first letters)                                                                 |
| `identifier`                     | JavaScript identifier names (string starting with **_**, **$**, or letter)                                                                    |
| `path`                           | Valid filesystem path (e.g. "abc/def")                                                                                                        |
| `absolute`, `abs`                | Valid absolute path (e.g. "/abc/def" or "C:\abd\def")                                                                                         |
| `relative`, `rel`                | Valid relative path (e.g. "../abc/def" or "..\abd\def")                                                                                       |
| `function`, `func`               | Functions (using **instanceof Function**)                                                                                                     |
| `object`, `obj`                  | Plain objects (using **typeof && !null** and constructor check)                                                                               |
| `objectlike`                     | Any object (using **typeof && !null**)                                                                                                        |
| `iterable`                       | Objects with a **Symbol.iterator** method (that can be used with **for..of** loops)                                                           |
| `circular`                       | Objects with one or more _circular references_ (use `!circular` to disallow circular references)                                              |
| `array`, `arr`                   | Plain arrays (using **instanceof Array** and constructor check)                                                                               |
| `arraylike`, `arguments`, `args` | Array-like objects (any object with numeric **.length** property, e.g. the **arguments** object)                                              |
| `map`                            | Instances of **Map**                                                                                                                          |
| `weakmap`                        | Instances of **WeakMap**                                                                                                                      |
| `set`                            | Instances of **Set**                                                                                                                          |
| `weakset`                        | Instances of **WeakSet**                                                                                                                      |
| `promise`                        | Instances of **Promise**                                                                                                                      |
| `date`                           | Instances of **Date**                                                                                                                         |
| `future`                         | Instances of **Date** with a value in the future                                                                                              |
| `past`                           | Instances of **Date** with a value in the past                                                                                                |
| `regex`, `regexp`                | Instances of **RegExp** (regular expressions)                                                                                                 |
| `error`, `err`                   | Instances of **Error**                                                                                                                        |
| `evalerror`                      | Instances of **EvalError**                                                                                                                    |
| `rangeerror`                     | Instances of **RangeError**                                                                                                                   |
| `referenceerror`                 | Instances of **ReferenceError**                                                                                                               |
| `syntaxerror`                    | Instances of **SyntaxError**                                                                                                                  |
| `typeerror`                      | Instances of **TypeError**                                                                                                                    |
| `urierror`                       | Instances of **URIError**                                                                                                                     |
| `symbol`                         | Value is **Symbol** (using **typeof**)                                                                                                        |
| `empty`                          | Value is empty (e.g. **v.length === 0** (string/array), **v.size === 0** (Map/Set), `Object.keys(v) === 0` (objects), or `!v` (anything else) |
| `any`, `mixed`                   | Allow any value (transparently passes through with no error)                                                                                  |
| `json`, `jsonable`               | Values that can be successfully converted to JSON _and back again!_ (null, true, false, finite numbers, strings, plain objects, plain arrays) |

### Literal types

If you want to validate a value against a literal string or number etc, you can use that string or number to make a type string:

e.g. `9|10|11` for a value matching either number 9, 10, or 11; or `0|false|'no'` for a value matching either the number 0, literal false, or the string "no".

| Format              | Description                                                           |
|---------------------|-----------------------------------------------------------------------|
| `"abc"`, `'abc'`    | Literal strings, e.g. `"Dave"` or `'Lucy'`                            |
| `1234`              | Literal numbers, e.g. `1234` or `123.456` or `-12`                    |
| `true`, `false`     | Literal boolean (note you can use `truthy` and `falsy` for soft equal |
| `undefined`, `null` | Literal undefined and null                                            |

### Type modifiers

Modifiers can be applied to any string identifier from the list above to modify that type's behaviour, e.g. `num?` for an optional number (also accepts undefined), `str[]` for an array of strings, or `["abc", 12|13]` for an array tuple containing the string "abc" and the number 12 or 13.

| Format              | Description                                                                            |
|---------------------|----------------------------------------------------------------------------------------|
| `(type)`            | Grouped type, e.g. `(num | str)[]`                                                     |
| `type1 & type2`     | AND combined type, e.g. `str & upper`                                                  |
| `type1 | type2`     | OR combined type, e.g. `num | str`                                                     |
| `type[]`            | Array type (all array entries must match type)                                         |
| `[type1, type2]`    | Tuple type (must match tuple exactly)                                                  |
| `{ type }`          | Object value type (all own props must match type                                       |
| `{ keyType: type }` | Object key:value type (keys and own props must match types)                            |
| `!type`             | Inverted type (opposite is allowed), e.g. `!str`                                       |
| `type?`             | Optional type (allows type or `undefined`), e.g. `str?`                                |
| `type+`             | Non-empty type, e.g. `str+` or `num[]+`                                                |
| `type{1,2}`         | Size type, e.g. `str{5}` or `arr{1,6}` or `map{12,}` or `set{,6}`                      |
| `return type`       | Changes error message from e.g. `Must be true` to `Must return true`                   |
| `prefix: type`      | Prepend prefix to error message, e.g. `name: Must be string` or `age: Must be integer` |

### Array type modifier

Any string type can be made into an array of that type by appending `[]` brackets to the type reference. This means the check looks for a plain array whose contents only include the specified type.

```js
// Pass.
check(["a", "b"], "str[]"); // No error.
check([1, 2, 3], "int[]"); // No error.
check([], "int[]"); // No error (empty is fine).
check([1], "int[]+"); // No error (non-empty).

// Fail.
check([1, 2], "str[]"); // Throws ValueError 'Must be plain array containing string (received [1, 2])'
check(["a"], "int[]"); // Throws ValueError 'Must be plain array containing integer (received ["a"])'
check([], "int[]+"); // Throws ValueError 'Must be non-empty plain array containing integer (received [])'
```

### Tuple type modifier

Array tuples can be specified by surrounding types in `[]` brackets.

```js
// Pass.
check([true, false], "[bool, bool]") // No error.
check(["a", "b"], "[str, str]") // No error.
check([1, 2, 3], "[num, num, num]"); // No error.

// Fail.
check([true, true], "[str, str]") // Throws ValueError 'Must be plain array tuple like [string, string] (received [true, true])'
check([true], "[bool, bool]") // Throws ValueError 'Must be plain array tuple like [boolean, boolean] (received [true])'
check(["a", "b", "c"], "[str, str]") // Throws ValueError 'Must be plain array tuple like [string, string] (received ["a", "b", "c"])'
```

### Object type modifier

Check for objects only containing strings of a specified type by surrounding the type in `{}` braces. This means the check looks for a plain object whose contents only include the specified type (whitespace is optional). If you specify multiple props (separated by commas) they are treated like `OR` conditions.

```js
// Pass.
check({ a: "a", b: "b" }, "{str}"); // No error.
check({ a: 1, b: 2 }, "{ int }"); // No error.
check({}, "{int}"); // No error (empty is fine).
check({ a: 1 }, "{int}+"); // No error (non-empty).
check({ a: 1, b: "B" }, "{ int, str }"); // No error (integers or strings are fine).

// Fail.
check({ a: 1, b: 2 }, "{str}"); // Throws ValueError 'Must be plain object like { string: string } (received { a: 1, b: 2 })'
check({ a: "a" }, "{ int }"); // Throws ValueError 'Must be plain object like { string: integer } (received { a: "a" })'
check({}, "{int}+"); // Throws ValueError 'Must be non-empty plain object like { string: integer } (received {})'
```

A type for the keys can also be specified by using `{ key: value }` format. Again multiple props can be specified separated by commas.

```js
// Pass.
check({ myVar: 123 }, "{ camel: int }"); // No error (key is camelCase).
check({ "my-var": 123 }, "{ kebab: int }"); // No error (key is kebab-case).
check({ "YAS": 123 }, "{ upper: bool }"); // No error (key is UPPERCASE).
check({ a: 1, B: true }, "{ lower: int, upper: bool }"); // No error (a is lowercase and integer, B is UPPERCASE and boolean).

// Fail.
check({ "myVar": 123 }, "{ kebab: int }"); // Throws ValueError 'Must be plain object like { kebab-case string: integer } (received { "myVar": 123 })'
check({ "nope": true }, "{ upper: bool }"); // Throws ValueError 'Must be plain object like { UPPERCASE string: boolean } (received { "nope": true })'
```

Exact props can be specified by wrapping the key string in quotes (single or double).

```js
// Pass.
check({ name: "Dave" }, '{ "name": str }');
check({ name: "Dave", age: 48 }, '{ "name": str, "age": int }');

// Fail.
check({ name: 123 }, '{ "name": str }'); // Throws ValueError 'Must be plain object like { "name": string } (received etc)"..'
check({ name: "Dave", age: "123" }, '{ "name": str, "age": int }'); // Throws ValueError 'Must be plain object like { "name": string, "age": integer }'(received etc)"
```

Exact prop checkers and normal checkers can be mixed in the same string type. If an exact key is specified it will be favoured.

```js
// Pass.
check({ name: "Dave", a: 1, b: 2 }, '{ "name": str, lower: int }');

// Fail.
check({ name: "Dave", a: 1, b: false }, '{ "name": str, lower: int }'); // Throws ValueError 'Must be plain object like { "name": string, lowercase string:'integer } (received etc)"
```

### Optional type modifier

Any string type can be made optional by appending a `?` question mark to the type reference. This means the check will also accept `undefined` in addition to the specified type.

```js
// Pass.
check(undefined, "str?"); // No error.
check(undefined, "lower?"); // No error.
check(undefined, "int?"); // No error.
check([undefined, undefined, 123], ["number?"]); // No error.

// Fail.
check(123, "str?"); // Throws ValueError 'Must be string (received 123)'
check(null, "str?"); // Throws ValueError 'Must be string (received null)'
```

### Non-empty type modifier

Any type can be made non-empty by appending a `+` plus sign to the type reference. This means the check will only pass if the value is non-empty. Specifically this works as follows:

- Strings: `.length` is more than 0
- Map and Set objects: `.size` is more than 0
- Objects and arrays: If it has a `.length` property Number of own properties is not zero (using `typeof === "object"` && `Object.keys()`)
- Booleans and numbers: Use truthyness (e.g. `true` is non-empty, `false` and `0` is empty)

This is equivalent to the inverse of the `empty` type.

```js
// Pass.
check("abc", "str+"); // No error.
check([1], "arr+"); // No error.
check({ a: 1 }, "obj+"); // No error.

// Fail.
check(123, "str+"); // Throws ValueError 'Must be non-empty string (received "")'
check([], "arr+"); // Throws ValueError 'Must be non-empty plain array (received [])'
check({}, "obj+"); // Throws ValueError 'Must be non-empty plain object (received {})'
```

### Size type modifier

To specify a size for the type, you can prepend minimum/maximum with e.g. `{12}`, `{4,8}`, `{4,}` or `{,8}` (e.g. RegExp style quantifiers). This allows you to specify e.g. a string with 12 characters, an array with between 10 and 20 items, or an integer with a minimum value of 4.

```js
// Pass.
check("abc", "str{3}"); // No error (string with exact length 3 characters).
check(4, "num{,4}"); // No error (number with maximum value 4).
check(["a", "b"], "arr{1,}"); // No error (array with more than 1 item).
check([1, 2, 3], "num[]{2,4}"); // No error (array of numbers with between 2 and 4 items).

// Fail.
check("ab", "str{3}"); // Throws ValueError 'Must be string with size 3'
check(4, "num{,4}"); // Throws ValueError 'Must be finite number with maximum size 4'
check(["a", "b"], "arr{1,}"); // Throws ValueError 'Must be array with minimum size 1'
check([1, 2, 3], "num[]{2,4}"); // Throws ValueError 'Must be plain array containing finite number with size between 2 and 4'
```

### Inverted type modifier

Any string type can inverted by prepending a `!` exclamation mark to the type reference. This means the check will only pass if the _inverse_ of its type is true.

```js
// Pass.
check(undefined, "!str"); // No error.
check("Abc", "!lower"); // No error.
check(123.456, "!integer"); // No error.
check([undefined, "abc", true, false], ["!number"]); // No error.

// Fail.
check(123, "!str"); // Throws ValueError 'Must be not string (received "abc")'
check(true, "!bool"); // Throws ValueError 'Must be not true or false (received true)'
check([undefined, "abc", true, 123], ["!number"]); // Throws ValueError 'array[3]: Must be not number (received 123)'
```

### Prefix and return type modifiers

Both of these modifiers modify the message of the error message that is thrown if the check doesn't pass. This allows you to ensure that your error messages are consistent and helpful.

Prefix types like `name: X` are used when you need to indicate the name of an argument or parameter in the thrown error if the value doesn't pass the check. Prefix types will modify the error message from `Must be X` to `name: Must be X` allowing the developer to understand which argument caused an error.

The `return X` return type will change the error message from `Must be X` to `Must return X`. It's designed to be when you're using `check()` to check a value returned from a callback function, or similar.

```js
// Create a function that uses both prefix and return type modifiers to check the return type of a callback.
function myFunc(callback) {
	// Check initial args.
	check(callback, "callback: func");

	// Call the callback and check the returned value.
	const result = callback();
	check(result, "callback: return false");
}

// Pass.
myFunc(() => false); // No error.

// Fail.
myFunc(123); // Throws ValueError 'myFunc(): callback: Must be function (received 123)'
myFunc(() => true); // Throws ValueError 'myFunc(): callback: Must return false (received true)'
```

### OR and AND type modifiers

You can use `&` and `|` to join string types together, to form AND and OR chains of allowed types. This allows you to compose together more complex types like `number | string` or `date | number | null` or `string && custom-checker`

`|` is used to create an OR type, meaning any of the values is valid, e.g. `number|string` or `string | null`

```js
// Pass.
check(123, "str|num"); // No error.
check("a", "str|num"); // No error.

// Fail.
check(null, "str|num"); // Throws ValueError 'Must be string or number (received null)'
check(null, "str|num|bool|func|obj"); // Throws ValueError 'Must be string or number or boolean or function or object (received null)'
```

`&` is used to create an AND type, meaning the value must pass _all_ of the checks to be valid. This is primarily useful for custom checkers e.g. `lower & username-unique`.

```js
// Add a checker that confirms a string contains the word "cat"
add("myapp-catty", v => v.toLowerCase().indexOf("cat") >= 0);

// Pass.
check("this cat is crazy!", "lower & myapp-catty"); // No error.
check("THIS CAT IS CRAZY", "upper & myapp-catty"); // No error.

// Fail.
check("THIS CAT IS CRAZY", "lower & myapp-catty"); // Throws ValueError 'Must be lowercase string and catty'
check("THIS DOG IS CRAZY", "string & myapp-catty"); // Throws ValueError 'Must be string and catty'
```

Note: Built in checkers like `lower` or `int+` already check the basic type of a value (e.g. string and number), so there's no need to use `string & lower` or `number & int+` — internally the value will be checked twice. Spaces around the `&` or `|` are optional.

`()` parentheses can be used to create a 'grouped type' which is useful to specify an array that allows several types, to make an invert/optional type of several types, or to state an explicit precence order for `&` and `|`.

```js
// Pass.
check([123, "abc"], "(str|num)[]"); // No error.
check({ a: 123, b: "abc" }, "!(str|num)"); // No error.
check("", "(int & truthy) | (str & falsy)"); // No error.
check(12, "(int & truthy) | (str & falsy)"); // No error.
```

## Roadmap and ideas

- [ ] Support `@decorator` syntax for class methods

## Contributing

See (CONTRIBUTING.md)

## Changelog

See [Releases](https://github.com/dhoulb/blork/releases)
