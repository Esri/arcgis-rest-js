/* eslint-disable */

// external dependencies
import { deepEqual } from 'fast-equals';

import memoize from '../src';
import { isSameValueZero } from '../src/utils';

describe('memoize', () => {
  it('will return the memoized function', () => {
    let callCount = 0;

    const fn = (one: any, two: any) => {
      callCount++;

      return {
        one,
        two,
      };
    };

    const memoized = memoize(fn);

    expect(memoized.cache.snapshot).toEqual({
      keys: [],
      size: 0,
      values: [],
    });
    expect(memoized.cache.snapshot).toEqual({
      keys: [],
      size: 0,
      values: [],
    });

    expect(memoized.isMemoized).toEqual(true);

    expect(memoized.options).toEqual({
      isEqual: isSameValueZero,
      isMatchingKey: undefined,
      isPromise: false,
      maxSize: 1,
      transformKey: undefined,
    });

    new Array(1000).fill('z').forEach(() => {
      const result = memoized('one', 'two');

      expect(result).toEqual({
        one: 'one',
        two: 'two',
      });
    });

    expect(callCount).toEqual(1);

    expect(memoized.cache.snapshot).toEqual({
      keys: [['one', 'two']],
      size: 1,
      values: [
        {
          one: 'one',
          two: 'two',
        },
      ],
    });
  });

  it('will return the memoized function that can have multiple cached key => value pairs', () => {
    let callCount = 0;

    const fn = (one: any, two: any) => {
      callCount++;

      return {
        one,
        two,
      };
    };
    const maxSize = 3;

    const memoized = memoize(fn, { maxSize });

    expect(memoized.cache.snapshot).toEqual({
      keys: [],
      size: 0,
      values: [],
    });

    expect(memoized.cache.snapshot).toEqual({
      keys: [],
      size: 0,
      values: [],
    });

    expect(memoized.isMemoized).toEqual(true);

    expect(memoized.options.maxSize).toEqual(maxSize);

    expect(memoized('one', 'two')).toEqual({
      one: 'one',
      two: 'two',
    });
    expect(memoized('two', 'three')).toEqual({
      one: 'two',
      two: 'three',
    });
    expect(memoized('three', 'four')).toEqual({
      one: 'three',
      two: 'four',
    });
    expect(memoized('four', 'five')).toEqual({
      one: 'four',
      two: 'five',
    });
    expect(memoized('two', 'three')).toEqual({
      one: 'two',
      two: 'three',
    });
    expect(memoized('three', 'four')).toEqual({
      one: 'three',
      two: 'four',
    });

    expect(callCount).toEqual(4);

    expect(memoized.cache.snapshot).toEqual({
      keys: [['three', 'four'], ['two', 'three'], ['four', 'five']],
      size: 3,
      values: [
        {
          one: 'three',
          two: 'four',
        },
        {
          one: 'two',
          two: 'three',
        },
        {
          one: 'four',
          two: 'five',
        },
      ],
    });
  });

  it('will return the memoized function that will use the custom isEqual method', () => {
    let callCount = 0;

    const fn = (one: any, two: any) => {
      callCount++;

      return {
        one,
        two,
      };
    };

    const memoized = memoize(fn, { isEqual: deepEqual });

    expect(memoized.options.isEqual).toBe(deepEqual);

    expect(
      memoized(
        { deep: { value: 'value' } },
        { other: { deep: { value: 'value' } } },
      ),
    ).toEqual({
      one: { deep: { value: 'value' } },
      two: { other: { deep: { value: 'value' } } },
    });

    expect(
      memoized(
        { deep: { value: 'value' } },
        { other: { deep: { value: 'value' } } },
      ),
    ).toEqual({
      one: { deep: { value: 'value' } },
      two: { other: { deep: { value: 'value' } } },
    });

    expect(callCount).toEqual(1);

    expect(memoized.cache.snapshot).toEqual({
      keys: [
        [{ deep: { value: 'value' } }, { other: { deep: { value: 'value' } } }],
      ],
      size: 1,
      values: [
        {
          one: { deep: { value: 'value' } },
          two: { other: { deep: { value: 'value' } } },
        },
      ],
    });
  });

  it('will return the memoized function that will use the transformKey method', () => {
    let callCount = 0;

    const fn = (one: any, two: any) => {
      callCount++;

      return {
        one,
        two,
      };
    };
    const transformKey = function(args: any[]) {
      return [JSON.stringify(args)];
    };

    const memoized = memoize(fn, { transformKey });

    expect(memoized.options.transformKey).toBe(transformKey);

    const fnArg1 = () => {};
    const fnArg2 = () => {};
    const fnArg3 = () => {};

    expect(memoized({ one: 'one' }, fnArg1)).toEqual({
      one: { one: 'one' },
      two: fnArg1,
    });
    expect(memoized({ one: 'one' }, fnArg2)).toEqual({
      one: { one: 'one' },
      two: fnArg1,
    });
    expect(memoized({ one: 'one' }, fnArg3)).toEqual({
      one: { one: 'one' },
      two: fnArg1,
    });

    expect(callCount).toEqual(1);

    expect(memoized.cache.snapshot).toEqual({
      keys: [['[{"one":"one"},null]']],
      size: 1,
      values: [
        {
          one: { one: 'one' },
          two: fnArg1,
        },
      ],
    });
  });

  it('will return the memoized function that will use the transformKey method with a custom isEqual', () => {
    let callCount = 0;

    const fn = (one: any, two: any) => {
      callCount++;

      return {
        one,
        two,
      };
    };
    const isEqual = function(key1: any, key2: any) {
      return key1.args === key2.args;
    };
    const transformKey = function(args: any[]) {
      return [
        {
          args: JSON.stringify(args),
        },
      ];
    };

    const memoized = memoize(fn, {
      isEqual,
      transformKey,
    });

    expect(memoized.options.isEqual).toBe(isEqual);
    expect(memoized.options.transformKey).toBe(transformKey);

    const fnArg1 = () => {};
    const fnArg2 = () => {};
    const fnArg3 = () => {};

    expect(memoized({ one: 'one' }, fnArg1)).toEqual({
      one: { one: 'one' },
      two: fnArg1,
    });
    expect(memoized({ one: 'one' }, fnArg2)).toEqual({
      one: { one: 'one' },
      two: fnArg1,
    });
    expect(memoized({ one: 'one' }, fnArg3)).toEqual({
      one: { one: 'one' },
      two: fnArg1,
    });

    expect(callCount).toEqual(1);

    expect(memoized.cache.snapshot).toEqual({
      keys: [
        [
          {
            args: '[{"one":"one"},null]',
          },
        ],
      ],
      size: 1,
      values: [
        {
          one: { one: 'one' },
          two: fnArg1,
        },
      ],
    });
  });

  it('will return a memoized method that will auto-remove the key from cache if isPromise is true and the promise is rejected', async () => {
    const timeout = 200;

    const error = new Error('boom');

    const fn = async (ignored: string) => {
      await new Promise((resolve: Function) => {
        setTimeout(resolve, timeout);
      });

      throw error;
    };
    const isPromise = true;

    const memoized = memoize(fn, { isPromise });

    expect(memoized.options.isPromise).toEqual(isPromise);

    const spy = jest.fn();

    memoized('foo').catch(spy);

    expect(memoized.cache.snapshot.keys.length).toEqual(1);
    expect(memoized.cache.snapshot.values.length).toEqual(1);

    await new Promise((resolve: Function) => {
      setTimeout(resolve, timeout + 50);
    });

    expect(memoized.cache.snapshot).toEqual({
      keys: [],
      size: 0,
      values: [],
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(error);
  });

  it('will fire the onCacheChange method passed with the cache when it is added to', () => {
    const fn = (one: string, two: string) => ({ one, two });
    const onCacheChange = jest.fn();

    const memoized = memoize(fn, { onCacheChange });

    expect(memoized.options.onCacheChange).toBe(onCacheChange);

    memoized('foo', 'bar');

    expect(onCacheChange).toHaveBeenCalledTimes(1);
    expect(onCacheChange).toHaveBeenCalledWith(
      memoized.cache,
      {
        onCacheChange,
        isEqual: isSameValueZero,
        isMatchingKey: undefined,
        isPromise: false,
        maxSize: 1,
        transformKey: undefined,
      },
      memoized,
    );
  });

  it('will fire the onCacheChange method passed with the cache when it is updated', () => {
    const fn = (one: string, two: string) => ({ one, two });
    const onCacheChange = jest.fn();
    const maxSize = 2;

    const memoized = memoize(fn, {
      maxSize,
      onCacheChange,
    });

    expect(memoized.options.onCacheChange).toBe(onCacheChange);

    memoized('foo', 'bar');

    expect(onCacheChange).toHaveBeenCalledTimes(1);
    expect(onCacheChange).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );

    onCacheChange.mockReset();

    memoized('bar', 'foo');

    expect(onCacheChange).toHaveBeenCalledTimes(1);
    expect(onCacheChange).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );

    onCacheChange.mockReset();

    memoized('bar', 'foo');

    expect(onCacheChange).toHaveBeenCalledTimes(0);

    onCacheChange.mockReset();

    memoized('foo', 'bar');

    expect(onCacheChange).toHaveBeenCalledTimes(1);
    expect(onCacheChange).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );

    onCacheChange.mockReset();

    memoized('foo', 'bar');

    expect(onCacheChange).toHaveBeenCalledTimes(0);
  });

  it('will not fire the onCacheHit method passed with the cache when it is added to', () => {
    const fn = (one: string, two: string) => ({ one, two });
    const onCacheHit = jest.fn();

    const memoized = memoize(fn, { onCacheHit });

    expect(memoized.options.onCacheHit).toBe(onCacheHit);

    memoized('foo', 'bar');

    expect(onCacheHit).toHaveBeenCalledTimes(0);
  });

  it('will fire the onCacheHit method passed with the cache when it is updated', () => {
    const fn = (one: any, two: any) => ({
      one,
      two,
    });
    const onCacheHit = jest.fn();
    const maxSize = 2;

    const memoized = memoize(fn, {
      maxSize,
      onCacheHit,
    });

    expect(memoized.options.onCacheHit).toBe(onCacheHit);

    memoized('foo', 'bar');

    expect(onCacheHit).toHaveBeenCalledTimes(0);

    memoized('bar', 'foo');

    expect(onCacheHit).toHaveBeenCalledTimes(0);

    memoized('bar', 'foo');

    expect(onCacheHit).toHaveBeenCalledTimes(1);
    expect(onCacheHit).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );

    onCacheHit.mockReset();

    memoized('foo', 'bar');

    expect(onCacheHit).toHaveBeenCalledTimes(1);
    expect(onCacheHit).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );

    onCacheHit.mockReset();

    memoized('foo', 'bar');

    expect(onCacheHit).toHaveBeenCalledTimes(1);
    expect(onCacheHit).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );
  });

  it('will fire the onCacheAdd method passed with the cache when it is added but not when hit', () => {
    const fn = (one: any, two: any) => ({
      one,
      two,
    });
    const onCacheAdd = jest.fn();

    const memoized = memoize(fn, { onCacheAdd });

    expect(memoized.options.onCacheAdd).toBe(onCacheAdd);

    memoized('foo', 'bar');

    expect(onCacheAdd).toHaveBeenCalledTimes(1);

    memoized('foo', 'bar');

    expect(onCacheAdd).toHaveBeenCalledTimes(1);
  });

  it('will fire the onCacheAdd method passed with the cache when it is added but never again', () => {
    const fn = (one: any, two: any) => ({
      one,
      two,
    });
    const onCacheAdd = jest.fn();
    const maxSize = 2;

    const memoized = memoize(fn, {
      maxSize,
      onCacheAdd,
    });

    expect(memoized.options.onCacheAdd).toBe(onCacheAdd);

    memoized('foo', 'bar');

    expect(onCacheAdd).toHaveBeenCalledTimes(1);
    expect(onCacheAdd).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );

    onCacheAdd.mockReset();

    memoized('bar', 'foo');

    expect(onCacheAdd).toHaveBeenCalledTimes(1);
    expect(onCacheAdd).toHaveBeenCalledWith(
      memoized.cache,
      memoized.options,
      memoized,
    );

    onCacheAdd.mockReset();

    memoized('bar', 'foo');

    expect(onCacheAdd).toHaveBeenCalledTimes(0);

    onCacheAdd.mockReset();

    memoized('foo', 'bar');

    expect(onCacheAdd).toHaveBeenCalledTimes(0);

    memoized('foo', 'bar');

    expect(onCacheAdd).toHaveBeenCalledTimes(0);
  });

  type Dictionary<Type> = {
    [key: string]: Type;
  };

  test('if recursive calls to self will be respected at runtime', () => {
    const calc = memoize(
      (
        object: { [key: string]: any },
        metadata: { c: number },
      ): Dictionary<any> =>
        Object.keys(object).reduce((totals: { [key: string]: number }, key) => {
          if (Array.isArray(object[key])) {
            totals[key] = object[key].map(
              (subObject: { [key: string]: number }) =>
                calc(subObject, metadata),
            );
          } else {
            totals[key] = object[key].a + object[key].b + metadata.c;
          }

          return totals;
        }, {}),
      {
        maxSize: 10,
      },
    );

    const data = {
      fifth: {
        a: 4,
        b: 5,
      },
      first: [
        {
          second: {
            a: 1,
            b: 2,
          },
        },
        {
          third: [
            {
              fourth: {
                a: 2,
                b: 3,
              },
            },
          ],
        },
      ],
    };
    const metadata = {
      c: 6,
    };

    const result1 = calc(data, metadata);
    const result2 = calc(data, metadata);

    expect(result1).toEqual(result2);
  });

  it('will re-memoize the function with merged options if already memoized', () => {
    const fn = () => {};

    const maxSize = 5;
    const isEqual = () => true;

    const memoized = memoize(fn, { maxSize });

    const reMemoized = memoize(memoized, { isEqual });

    expect(reMemoized).not.toBe(memoized);
    expect(reMemoized.options.maxSize).toBe(maxSize);
    expect(reMemoized.options.isEqual).toBe(isEqual);
  });

  it('will throw an error if not a function', () => {
    const fn = 123;

    // @ts-ignore
    expect(() => memoize(fn)).toThrow();
  });
});
