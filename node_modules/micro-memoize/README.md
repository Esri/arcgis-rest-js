# micro-memoize

A tiny, crazy [fast](#benchmarks) memoization library for the 95% use-case

## Table of contents

- [micro-memoize](#micro-memoize)
  - [Table of contents](#table-of-contents)
  - [Summary](#summary)
  - [Importing](#importing)
  - [Usage](#usage)
    - [Types](#types)
    - [Composition](#composition)
  - [Options](#options)
    - [isEqual](#isequal)
    - [isMatchingKey](#ismatchingkey)
    - [isPromise](#ispromise)
    - [maxSize](#maxsize)
    - [onCacheAdd](#oncacheadd)
    - [onCacheChange](#oncachechange)
    - [onCacheHit](#oncachehit)
    - [transformKey](#transformkey)
  - [Additional properties](#additional-properties)
    - [memoized.cache](#memoizedcache)
      - [memoized.cache.snapshot](#memoizedcachesnapshot)
    - [memoized.fn](#memoizedfn)
    - [memoized.isMemoized](#memoizedismemoized)
    - [memoized.options](#memoizedoptions)
  - [Benchmarks](#benchmarks)
    - [Single parameter (primitive only)](#single-parameter-primitive-only)
    - [Single parameter (complex object)](#single-parameter-complex-object)
    - [Multiple parameters (primitives only)](#multiple-parameters-primitives-only)
    - [Multiple parameters (complex objects)](#multiple-parameters-complex-objects)
  - [Browser support](#browser-support)
  - [Node support](#node-support)
  - [Development](#development)

## Summary

As the author of [`moize`](https://github.com/planttheidea/moize), I created a consistently fast memoization library, but `moize` has a lot of features to satisfy a large number of edge cases. `micro-memoize` is a simpler approach, focusing on the core feature set with a much smaller footprint (~1.5kB minified+gzipped). Stripping out these edge cases also allows `micro-memoize` to be faster across the board than `moize`.

## Importing

ESM in browsers:

```ts
import memoize from "micro-memoize";
```

ESM in NodeJS:

```ts
import memoize from "micro-memoize/mjs";
```

CommonJS:

```ts
const memoize = require("micro-memoize");
```

## Usage

```ts
const assembleToObject = (one: string, two: string) => ({ one, two });

const memoized = memoize(assembleToObject);

console.log(memoized("one", "two")); // {one: 'one', two: 'two'}
console.log(memoized("one", "two")); // pulled from cache, {one: 'one', two: 'two'}
```

### Types

If you need them, all types are available under the `MicroMemoize` namespace.

```ts
import { MicroMemoize } from "micro-memoize";
```

### Composition

Starting in `4.0.0`, you can compose memoized functions if you want to have multiple types of memoized versions based on different options.

```ts
const simple = memoized(fn); // { maxSize: 1 }
const upToFive = memoized(simple, { maxSize: 5 }); // { maxSize: 5 }
const withCustomEquals = memoized(upToFive, { isEqual: deepEqual }); // { maxSize: 5, isEqual: deepEqual }
```

**NOTE**: The original function is the function used in the composition, the composition only applies to the options. In the example above, `upToFive` does not call `simple`, it calls `fn`.

## Options

### isEqual

`function(object1: any, object2: any): boolean`, _defaults to `isSameValueZero`_

Custom method to compare equality of keys, determining whether to pull from cache or not, by comparing each argument in order.

Common use-cases:

- Deep equality comparison
- Limiting the arguments compared

```ts
import { deepEqual } from "fast-equals";

type ContrivedObject = {
  deep: string;
};

const deepObject = (object: {
  foo: ContrivedObject;
  bar: ContrivedObject;
}) => ({
  foo: object.foo,
  bar: object.bar
});

const memoizedDeepObject = memoize(deepObject, { isEqual: deepEqual });

console.log(
  memoizedDeepObject({
    foo: {
      deep: "foo"
    },
    bar: {
      deep: "bar"
    },
    baz: {
      deep: "baz"
    }
  })
); // {foo: {deep: 'foo'}, bar: {deep: 'bar'}}

console.log(
  memoizedDeepObject({
    foo: {
      deep: "foo"
    },
    bar: {
      deep: "bar"
    },
    baz: {
      deep: "baz"
    }
  })
); // pulled from cache
```

**NOTE**: The default method tests for [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero) equality, which is summarized as strictly equal while also considering `NaN` equal to `NaN`.

### isMatchingKey

`function(object1: any[], object2: any[]): boolean`

Custom method to compare equality of keys, determining whether to pull from cache or not, by comparing the entire key.

Common use-cases:

- Comparing the shape of the key
- Matching on values regardless of order
- Serialization of arguments

```ts
import { deepEqual } from "fast-equals";

type ContrivedObject = { foo: string; bar: number };

const deepObject = (object: ContrivedObject) => ({
  foo: object.foo,
  bar: object.bar
});

const memoizedShape = memoize(deepObject, {
  // receives the full key in cache and the full key of the most recent call
  isMatchingKey([object1]: [ContrivedObject], [object2]: [ContrivedObject]) {
    return (
      object1.hasOwnProperty("foo") &&
      object2.hasOwnProperty("foo") &&
      object1.bar === object2.bar
    );
  }
});

console.log(
  memoizedShape({
    foo: "foo",
    bar: "bar",
    baz: "baz"
  })
); // {foo: {deep: 'foo'}, bar: {deep: 'bar'}}

console.log(
  memoizedShape({
    foo: "not foo",
    bar: "bar",
    baz: "baz"
  })
); // pulled from cache
```

### isPromise

`boolean`, _defaults to `false`_

Identifies the value returned from the method as a `Promise`, which will result in one of two possible scenarios:

- If the promise is resolved, it will fire the `onCacheHit` and `onCacheChange` options
- If the promise is rejected, it will trigger auto-removal from cache

```ts
const fn = async (one: string, two: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error({ one, two }));
    }, 500);
  });
};

const memoized = memoize(fn, { isPromise: true });

memoized("one", "two");

console.log(memoized.cache.snapshot.keys); // [['one', 'two']]
console.log(memoized.cache.snapshot.values); // [Promise]

setTimeout(() => {
  console.log(memoized.cache.snapshot.keys); // []
  console.log(memoized.cache.snapshot.values); // []
}, 1000);
```

**NOTE**: If you don't want rejections to auto-remove the entry from cache, set `isPromise` to `false` (or simply do not set it), but be aware this will also remove the cache listeners that fire on successful resolution.

### maxSize

`number`, _defaults to `1`_

The number of values to store in cache, based on a [Least Recently Used](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_Recently_Used_.28LRU.29) basis. This operates the same as [`maxSize`](https://github.com/planttheidea/moize#maxsize) on `moize`, with the exception of the default being different.

```ts
const manyPossibleArgs = (one: string, two: string) => [one, two];

const memoized = memoize(manyPossibleArgs, { maxSize: 3 });

console.log(memoized("one", "two")); // ['one', 'two']
console.log(memoized("two", "three")); // ['two', 'three']
console.log(memoized("three", "four")); // ['three', 'four']

console.log(memoized("one", "two")); // pulled from cache
console.log(memoized("two", "three")); // pulled from cache
console.log(memoized("three", "four")); // pulled from cache

console.log(memoized("four", "five")); // ['four', 'five'], drops ['one', 'two'] from cache
```

**NOTE**: The default for `micro-memoize` differs from the default implementation of `moize`. `moize` will store an infinite number of results unless restricted, whereas `micro-memoize` will only store the most recent result. In this way, the default implementation of `micro-memoize` operates more like [`moize.simple`](https://github.com/planttheidea/moize#moizesimple).

### onCacheAdd

`function(cache: Cache, options: Options): void`

Callback method that executes whenever the cache is added to. This is mainly to allow for higher-order caching managers that use `micro-memoize` to perform superset functionality on the `cache` object.

```ts
const fn = (one: string, two: string) => [one, two];

const memoized = memoize(fn, {
  onCacheAdd(cache: Cache, options: Options) {
    console.log("cache has been added to: ", cache);
    console.log("memoized method has the following options applied: ", options);
  }
});

memoized("foo", "bar"); // cache has been added to
memoized("foo", "bar");
memoized("foo", "bar");

memoized("bar", "foo"); // cache has been added to
memoized("bar", "foo");
memoized("bar", "foo");

memoized("foo", "bar");
memoized("foo", "bar");
memoized("foo", "bar");
```

**NOTE**: This method is not executed when the `cache` is manually manipulated, only when changed via calling the memoized method.

### onCacheChange

`function(cache: Cache, options: Options): void`

Callback method that executes whenever the cache is added to or the order is updated. This is mainly to allow for higher-order caching managers that use `micro-memoize` to perform superset functionality on the `cache` object.

```ts
const fn = (one: string, two: string) => [one, two];

const memoized = memoize(fn, {
  onCacheChange(cache: Cache, options: Options) {
    console.log("cache has changed: ", cache);
    console.log("memoized method has the following options applied: ", options);
  }
});

memoized("foo", "bar"); // cache has changed
memoized("foo", "bar");
memoized("foo", "bar");

memoized("bar", "foo"); // cache has changed
memoized("bar", "foo");
memoized("bar", "foo");

memoized("foo", "bar"); // cache has changed
memoized("foo", "bar");
memoized("foo", "bar");
```

**NOTE**: This method is not executed when the `cache` is manually manipulated, only when changed via calling the memoized method. When the execution of other cache listeners (`onCacheAdd`, `onCacheHit`) is applicable, this method will execute after those methods.

### onCacheHit

`function(cache: Cache, options: Options): void`

Callback method that executes whenever the cache is hit, whether the order is updated or not. This is mainly to allow for higher-order caching managers that use `micro-memoize` to perform superset functionality on the `cache` object.

```ts
const fn = (one: string, two: string) => [one, two];

const memoized = memoize(fn, {
  maxSize: 2,
  onCacheHit(cache: Cache, options: Options) {
    console.log("cache was hit: ", cache);
    console.log("memoized method has the following options applied: ", options);
  }
});

memoized("foo", "bar");
memoized("foo", "bar"); // cache was hit
memoized("foo", "bar"); // cache was hit

memoized("bar", "foo");
memoized("bar", "foo"); // cache was hit
memoized("bar", "foo"); // cache was hit

memoized("foo", "bar"); // cache was hit
memoized("foo", "bar"); // cache was hit
memoized("foo", "bar"); // cache was hit
```

**NOTE**: This method is not executed when the `cache` is manually manipulated, only when changed via calling the memoized method.

### transformKey

`function(Array<any>): any`

A method that allows you transform the key that is used for caching, if you want to use something other than the pure arguments.

```ts
const ignoreFunctionArgs = (one: string, two: () => {}) => [one, two];

const memoized = memoize(ignoreFunctionArgs, {
  transformKey: JSON.stringify
});

console.log(memoized("one", () => {})); // ['one', () => {}]
console.log(memoized("one", () => {})); // pulled from cache, ['one', () => {}]
```

If your transformed keys require something other than `SameValueZero` equality, you can combine `transformKey` with [`isEqual`](#isequal) for completely custom key creation and comparison.

```ts
const ignoreFunctionArgs = (one: string, two: () => {}) => [one, two];

const memoized = memoize(ignoreFunctionArgs, {
  isEqual(key1: string, key2: string) {
    return key1.args === key2.args;
  },
  transformKey(args: any[]) {
    return {
      args: JSON.stringify(args)
    };
  }
});

console.log(memoized("one", () => {})); // ['one', () => {}]
console.log(memoized("one", () => {})); // pulled from cache, ['one', () => {}]
```

## Additional properties

### memoized.cache

`Object`

The `cache` object that is used internally. The shape of this structure:

```ts
{
  keys: any[][], // available as MicroMemoize.Key[]
  values: any[] // available as MicroMemoize.Value[]
}
```

The exposure of this object is to allow for manual manipulation of keys/values (injection, removal, expiration, etc).

```ts
const method = (one: string, two: string) => ({ one, two });

const memoized = memoize(method);

memoized.cache.keys.push(["one", "two"]);
memoized.cache.values.push("cached");

console.log(memoized("one", "two")); // 'cached'
```

**NOTE**: `moize` offers a variety of convenience methods for this manual `cache` manipulation, and while `micro-memoize` allows all the same capabilities by exposing the `cache`, it does not provide any convenience methods.

#### memoized.cache.snapshot

`Object`

This is identical to the `cache` object referenced above, but it is a deep clone created at request, which will provide a persistent snapshot of the values at that time. This is useful when tracking the cache changes over time, as the `cache` object is mutated internally for performance reasons.

### memoized.fn

`function`

The original function passed to be memoized.

### memoized.isMemoized

`boolean`

Hard-coded to `true` when the function is memoized. This is useful for introspection, to identify if a method has been memoized or not.

### memoized.options

`Object`

The [`options`](#options) passed when creating the memoized method.

## Benchmarks

All values provided are the number of operations per second (ops/sec) calculated by the [Benchmark suite](https://benchmarkjs.com/). Note that `underscore`, `lodash`, and `ramda` do not support mulitple-parameter memoization (which is where `micro-memoize` really shines), so they are not included in those benchmarks.

Benchmarks was performed on an i7 8-core Arch Linux laptop with 16GB of memory using NodeJS version `10.15.0`. The default configuration of each library was tested with a fibonacci calculation based on the following parameters:

- Single primitive = `35`
- Single object = `{number: 35}`
- Multiple primitives = `35, true`
- Multiple objects = `{number: 35}, {isComplete: true}`

**NOTE**: Not all libraries tested support multiple parameters out of the box, but support the ability to pass a custom `resolver`. Because these often need to resolve to a string value, [a common suggestion](https://github.com/lodash/lodash/issues/2115) is to just `JSON.stringify` the arguments, so that is what is used when needed.

### Single parameter (primitive only)

This is usually what benchmarks target for ... its the least-likely use-case, but the easiest to optimize, often at the expense of more common use-cases.

|                   | Operations / second |
| ----------------- | ------------------- |
| fast-memoize      | 59,069,204          |
| **micro-memoize** | **48,267,295**      |
| lru-memoize       | 46,781,143          |
| Addy Osmani       | 32,372,414          |
| lodash            | 29,297,916          |
| ramda             | 25,054,838          |
| mem               | 24,848,072          |
| underscore        | 24,847,818          |
| memoizee          | 18,272,987          |
| memoizerific      | 7,302,835           |

### Single parameter (complex object)

This is what most memoization libraries target as the primary use-case, as it removes the complexities of multiple arguments but allows for usage with one to many values.

|                   | Operations / second |
| ----------------- | ------------------- |
| **micro-memoize** | **40,360,621**      |
| lodash            | 30,862,028          |
| lru-memoize       | 25,740,572          |
| memoizee          | 12,058,375          |
| memoizerific      | 6,854,855           |
| ramda             | 2,287,030           |
| underscore        | 2,270,574           |
| Addy Osmani       | 2,076,031           |
| mem               | 2,001,984           |
| fast-memoize      | 1,591,019           |

### Multiple parameters (primitives only)

This is a very common use-case for function calls, but can be more difficult to optimize because you need to account for multiple possibilities ... did the number of arguments change, are there default arguments, etc.

|                   | Operations / second |
| ----------------- | ------------------- |
| **micro-memoize** | **33,546,353**      |
| lru-memoize       | 20,884,669          |
| memoizee          | 7,831,161           |
| Addy Osmani       | 6,447,448           |
| memoizerific      | 5,587,779           |
| mem               | 2,620,943           |
| underscore        | 1,617,687           |
| ramda             | 1,569,167           |
| lodash            | 1,512,515           |
| fast-memoize      | 1,376,665           |

### Multiple parameters (complex objects)

This is the most robust use-case, with the same complexities as multiple primitives but managing bulkier objects with additional edge scenarios (destructured with defaults, for example).

|                   | Operations / second |
| ----------------- | ------------------- |
| **micro-memoize** | **34,857,438**      |
| lru-memoize       | 20,838,330          |
| memoizee          | 7,820,066           |
| memoizerific      | 5,761,357           |
| mem               | 1,184,550           |
| ramda             | 1,034,937           |
| underscore        | 1,021,480           |
| Addy Osmani       | 1,014,642           |
| lodash            | 1,014,060           |
| fast-memoize      | 949,213             |

## Browser support

- Chrome (all versions)
- Firefox (all versions)
- Edge (all versions)
- Opera 15+
- IE 9+
- Safari 6+
- iOS 8+
- Android 4+

## Node support

- 4+

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

- `build` => run webpack to build development `dist` file with NODE_ENV=development
- `build:minifed` => run webpack to build production `dist` file with NODE_ENV=production
- `dev` => run webpack dev server to run example app (playground!)
- `dist` => runs `build` and `build-minified`
- `lint` => run ESLint against all files in the `src` folder
- `prepublish` => runs `compile-for-publish`
- `prepublish:compile` => run `lint`, `test`, `transpile:es`, `transpile:lib`, `dist`
- `test` => run AVA test functions with `NODE_ENV=test`
- `test:coverage` => run `test` but with `nyc` for coverage checker
- `test:watch` => run `test`, but with persistent watcher
- `transpile:lib` => run babel against all files in `src` to create files in `lib`
- `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
