import { Dictionary, MicroMemoize } from './types';

/**
 * @constant DEFAULT_OPTIONS_KEYS the default options keys
 */
const DEFAULT_OPTIONS_KEYS: Dictionary<true> = {
  isEqual: true,
  isMatchingKey: true,
  isPromise: true,
  maxSize: true,
  onCacheAdd: true,
  onCacheChange: true,
  onCacheHit: true,
  transformKey: true,
};

/**
 * @function slice
 *
 * @description
 * slice.call() pre-bound
 */
export const { slice } = Array.prototype;

/**
 * @function cloneArray
 *
 * @description
 * clone the array-like object and return the new array
 *
 * @param arrayLike the array-like object to clone
 * @returns the clone as an array
 */
export function cloneArray(arrayLike: any[] | IArguments) {
  const { length } = arrayLike;

  if (!length) {
    return [];
  }

  if (length === 1) {
    return [arrayLike[0]];
  }

  if (length === 2) {
    return [arrayLike[0], arrayLike[1]];
  }

  if (length === 3) {
    return [arrayLike[0], arrayLike[1], arrayLike[2]];
  }

  return slice.call(arrayLike, 0);
}

/**
 * @function getCustomOptions
 *
 * @description
 * get the custom options on the object passed
 *
 * @param options the memoization options passed
 * @returns the custom options passed
 */
export function getCustomOptions(options: MicroMemoize.Options) {
  const customOptions: MicroMemoize.Options = {};

  /* eslint-disable no-restricted-syntax */

  for (const key in options) {
    if (!DEFAULT_OPTIONS_KEYS[key]) {
      customOptions[key] = options[key];
    }
  }

  /* eslint-enable */

  return customOptions;
}

/**
 * @function isMemoized
 *
 * @description
 * is the function passed already memoized
 *
 * @param fn the function to test
 * @returns is the function already memoized
 */
export function isMemoized(fn: any): fn is MicroMemoize.Memoized<Function> {
  return (
    typeof fn === 'function' &&
    (fn as MicroMemoize.Memoized<Function>).isMemoized
  );
}

/**
 * @function isSameValueZero
 *
 * @description
 * are the objects equal based on SameValueZero equality
 *
 * @param object1 the first object to compare
 * @param object2 the second object to compare
 * @returns are the two objects equal
 */
export function isSameValueZero(object1: any, object2: any) {
  // eslint-disable-next-line no-self-compare
  return object1 === object2 || (object1 !== object1 && object2 !== object2);
}

/**
 * @function mergeOptions
 *
 * @description
 * merge the options into the target
 *
 * @param existingOptions the options provided
 * @param newOptions the options to include
 * @returns the merged options
 */
export function mergeOptions(
  existingOptions: MicroMemoize.NormalizedOptions,
  newOptions: MicroMemoize.Options,
): Readonly<MicroMemoize.NormalizedOptions> {
  // @ts-ignore
  const target: MicroMemoize.NormalizedOptions = {};

  /* eslint-disable no-restricted-syntax */

  for (const key in existingOptions) {
    target[key] = existingOptions[key];
  }

  for (const key in newOptions) {
    target[key] = newOptions[key];
  }

  /* eslint-enable */

  return target;
}
