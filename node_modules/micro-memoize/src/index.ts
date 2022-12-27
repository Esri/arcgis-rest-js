// cache
import { Cache } from './Cache';

// types
import { MicroMemoize } from './types';

// utils
import {
  cloneArray,
  getCustomOptions,
  isMemoized,
  isSameValueZero,
  mergeOptions,
} from './utils';

function createMemoizedFunction<Fn extends Function>(
  fn: Fn | MicroMemoize.Memoized<Fn>,
  options: MicroMemoize.Options = {},
): MicroMemoize.Memoized<Fn> {
  if (isMemoized(fn)) {
    return createMemoizedFunction(fn.fn, mergeOptions(fn.options, options));
  }

  if (typeof fn !== 'function') {
    throw new TypeError('You must pass a function to `memoize`.');
  }

  const {
    isEqual = isSameValueZero,
    isMatchingKey,
    isPromise = false,
    maxSize = 1,
    onCacheAdd,
    onCacheChange,
    onCacheHit,
    transformKey,
  } = options;

  const normalizedOptions = mergeOptions(
    {
      isEqual,
      isMatchingKey,
      isPromise,
      maxSize,
      onCacheAdd,
      onCacheChange,
      onCacheHit,
      transformKey,
    },
    getCustomOptions(options),
  );

  const cache = new Cache(normalizedOptions);

  const {
    keys,
    values,
    canTransformKey,
    shouldCloneArguments,
    shouldUpdateOnAdd,
    shouldUpdateOnChange,
    shouldUpdateOnHit,
  } = cache;

  // @ts-ignore
  const memoized: Memoized<Fn> = function memoized(this) {
    // @ts-ignore
    let key: MicroMemoize.Key = shouldCloneArguments
      ? cloneArray(arguments)
      : arguments;

    if (canTransformKey) {
      key = (transformKey as MicroMemoize.KeyTransformer)(key);
    }

    const keyIndex = keys.length ? cache.getKeyIndex(key) : -1;

    if (keyIndex !== -1) {
      if (shouldUpdateOnHit) {
        (onCacheHit as MicroMemoize.CacheModifiedHandler)(
          cache,
          normalizedOptions,
          memoized,
        );
      }

      if (keyIndex) {
        cache.orderByLru(keys[keyIndex], values[keyIndex], keyIndex);

        if (shouldUpdateOnChange) {
          (onCacheChange as MicroMemoize.CacheModifiedHandler)(
            cache,
            normalizedOptions,
            memoized,
          );
        }
      }
    } else {
      const newValue = fn.apply(this, arguments);
      const newKey = shouldCloneArguments
        ? (key as any[])
        : cloneArray(arguments);

      cache.orderByLru(newKey, newValue, keys.length);

      if (isPromise) {
        cache.updateAsyncCache(memoized);
      }

      if (shouldUpdateOnAdd) {
        (onCacheAdd as MicroMemoize.CacheModifiedHandler)(
          cache,
          normalizedOptions,
          memoized,
        );
      }

      if (shouldUpdateOnChange) {
        (onCacheChange as MicroMemoize.CacheModifiedHandler)(
          cache,
          normalizedOptions,
          memoized,
        );
      }
    }

    return values[0];
  };

  memoized.cache = cache;
  memoized.fn = fn;
  memoized.isMemoized = true as const;
  memoized.options = normalizedOptions;

  return memoized;
}

export default createMemoizedFunction;
