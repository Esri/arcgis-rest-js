type Dictionary<Type> = {
  [key: string]: Type;
  [index: number]: Type;
};

export declare namespace MicroMemoize {
  export type Key = any[];
  export type Value = any;

  export type RawKey = Key | IArguments;

  export type Cache = import('./src/Cache').Cache;

  export type EqualityComparator = (object1: any, object2: any) => boolean;

  export type MatchingKeyComparator = (key1: Key, key2: RawKey) => boolean;

  export type CacheModifiedHandler = (
    cache: Cache,
    options: NormalizedOptions,
    memoized: Function,
  ) => void;

  export type KeyTransformer = (args: Key) => Key;

  export type KeyIndexGetter = (keyToMatch: RawKey) => number;

  export type StandardOptions = {
    isEqual?: EqualityComparator;
    isMatchingKey?: MatchingKeyComparator;
    isPromise?: boolean;
    maxSize?: number;
    onCacheAdd?: CacheModifiedHandler;
    onCacheChange?: CacheModifiedHandler;
    onCacheHit?: CacheModifiedHandler;
    transformKey?: KeyTransformer;
  };

  export type Options = StandardOptions & Dictionary<any>;
  export type NormalizedOptions = Options & {
    isEqual: EqualityComparator;
    isPromise: boolean;
    maxSize: number;
  };

  export type Memoized<Fn extends Function> = Fn &
    Dictionary<any> & {
      cache: Cache;
      fn: Fn;
      isMemoized: true;
      options: NormalizedOptions;
    };
}

export default function memoize<Fn extends Function>(
  fn: Fn | MicroMemoize.Memoized<Fn>,
  options?: MicroMemoize.Options,
): MicroMemoize.Memoized<Fn>;
