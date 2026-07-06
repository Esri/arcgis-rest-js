/* Copyright (c) 2026 Environmental Systems Research Institute, Inc. */

import { ILegacyRequestOptions, IRequestOptions } from "./IRequestOptions.js";

type PureRequestOptions = Omit<IRequestOptions, keyof ILegacyRequestOptions>;

type PureRequestOptionsKeys = Array<keyof PureRequestOptions>;

const ALLOWED_TOP_LEVEL_KEYS: PureRequestOptionsKeys = [
  "authentication",
  "portal",
  "fetchOptions",
  "requestFlags",
  "params"
];

const REQUEST_OPTION_KEYS = new Set<string>(ALLOWED_TOP_LEVEL_KEYS);

type ProcessOptionsResult<T extends IRequestOptions> = {
  requestOptions: IRequestOptions;
} & Partial<Omit<T, keyof IRequestOptions>>;

interface ProcessOptionsConfig<T extends IRequestOptions> {
  paramKeys: Array<Exclude<keyof T, keyof IRequestOptions>>;
  extractKeys: Array<keyof T>;
  overwriteOptions?: Partial<Omit<IRequestOptions, "params">>;
}

export function processOptions<T extends IRequestOptions>(
  options: T,
  optionsConfig: ProcessOptionsConfig<T>
): ProcessOptionsResult<T> {
  const { paramKeys, extractKeys, overwriteOptions } = optionsConfig;

  // internally redefine types as Record type for parsing and merging
  const originalOptions = options as Record<string, any>;
  const requestOptionsOut: Record<string, any> = {};
  const overwriteOptionsAs = (overwriteOptions ?? {}) as Record<string, any>;
  const toParams: Record<string, any> = {};
  const toExtract: Record<string, any> = {};

  const existsIn = (obj: Record<string, any>, key: string) =>
    Object.prototype.hasOwnProperty.call(obj, key);

  // 1) move non-request-option param keys into params bucket
  paramKeys.forEach((key) => {
    const keyName = key as string;
    if (
      existsIn(originalOptions, keyName) &&
      !REQUEST_OPTION_KEYS.has(keyName)
    ) {
      toParams[keyName] = originalOptions[keyName];
    }
  });

  // 2) extract requested top-level keys
  extractKeys.forEach((key) => {
    const keyName = key as string;
    if (existsIn(originalOptions, keyName)) {
      toExtract[keyName] = originalOptions[keyName];
    }
  });

  // 3) build requestOptions with presence-based inclusion
  const OVERWRITEABLE_KEYS: Array<"authentication" | "portal"> = [
    "authentication",
    "portal"
  ];
  const MERGEABLE_KEYS: Array<"fetchOptions" | "requestFlags"> = [
    "fetchOptions",
    "requestFlags"
    // no params here because params is handled separately
  ];

  OVERWRITEABLE_KEYS.forEach((key) => {
    if (existsIn(originalOptions, key)) {
      requestOptionsOut[key] = originalOptions[key];
    }
    if (existsIn(overwriteOptionsAs, key)) {
      requestOptionsOut[key] = overwriteOptionsAs[key];
    }
  });

  MERGEABLE_KEYS.forEach((key) => {
    if (existsIn(originalOptions, key) || existsIn(overwriteOptionsAs, key)) {
      requestOptionsOut[key] = {
        ...(originalOptions[key] ?? {}),
        ...(overwriteOptionsAs[key] ?? {})
      };
    }
  });

  // if options has a params object or if any top-level options keys were delegated to become params, merge them into requestOptions.params
  if (existsIn(originalOptions, "params") || Object.keys(toParams).length > 0) {
    requestOptionsOut.params = {
      ...(originalOptions.params ?? {}),
      ...toParams
    };
  }

  return {
    ...(toExtract as Partial<Omit<T, keyof IRequestOptions>>),
    requestOptions: requestOptionsOut as IRequestOptions
  };
}
