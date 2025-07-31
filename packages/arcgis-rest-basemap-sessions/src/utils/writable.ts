/**
 * Utility type to convert all properties of an object type to writable.
 *
 * If needed a more complex version of is available at: https://github.com/sindresorhus/type-fest/blob/main/source/writable.d.ts
 */
export type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};
