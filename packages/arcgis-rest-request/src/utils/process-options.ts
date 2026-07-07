/* Copyright (c) 2026 Environmental Systems Research Institute, Inc. */

import { ILegacyRequestOptions, IRequestOptions } from "./IRequestOptions.js";

// using PureRequestOptions to explicitly only support v5 requestOptions until legacy requestOptions are removed from IRequestOptions
type PureRequestOptions = Omit<IRequestOptions, keyof ILegacyRequestOptions>;
type RequestOptionsKeys = keyof PureRequestOptions;

// using ExtractableKey to explicitly define that only non IRequestOptions keys can be extracted to help avoid duplicate exports in props
type ExtractableKey<T extends IRequestOptions> = Exclude<
  keyof T,
  keyof IRequestOptions
>;
type OverwriteableOptions = Pick<
  PureRequestOptions,
  "authentication" | "portal" | "fetchOptions" | "requestFlags"
>;

type ProcessOptionsResult<T extends IRequestOptions> = {
  requestOptions: Partial<PureRequestOptions>;
} & Partial<Pick<T, ExtractableKey<T>>>;

interface ProcessOptionsConfig<T extends IRequestOptions> {
  paramKeys: Array<ExtractableKey<T>>;
  extractKeys: Array<ExtractableKey<T>>;
  overwriteOptions?: Partial<OverwriteableOptions>;
  moveRemainingToParams?: boolean;
}

export function processOptions<T extends IRequestOptions>(
  options: T,
  optionsConfig: ProcessOptionsConfig<T>
): ProcessOptionsResult<T> {
  const { paramKeys, extractKeys, overwriteOptions, moveRemainingToParams } =
    optionsConfig;

  // internally redefine types as Record type for parsing and merging
  const originalOptions = options as Record<string, any>;
  const requestOptionsOut: Record<string, any> = {};
  const overwriteOptionsAs = (overwriteOptions ?? {}) as Record<string, any>;
  const toParams: Record<string, any> = {};
  const toExtract: Record<string, any> = {};

  const existsIn = (obj: Record<string, any>, key: string) =>
    Object.prototype.hasOwnProperty.call(obj, key);

  const REQUEST_OPTION_KEYS = new Set<RequestOptionsKeys>([
    "authentication",
    "portal",
    "fetchOptions",
    "requestFlags",
    "params"
  ]);

  // 1) move non-request-option paramkeys into params bucket
  paramKeys.forEach((key) => {
    const keyName = key as string;
    if (
      existsIn(originalOptions, keyName) &&
      // requestOptions keys should not be able to be added to paramKeys, enforce here
      !REQUEST_OPTION_KEYS.has(keyName as RequestOptionsKeys)
    ) {
      toParams[keyName] = originalOptions[keyName];
    }
  });

  // 2) extract requested top-level keys into bucket
  extractKeys.forEach((key) => {
    const keyName = key as string;
    if (existsIn(originalOptions, keyName)) {
      toExtract[keyName] = originalOptions[keyName];
    }
  });

  // 2b) optionally move all remaining non-request-option, non-extracted keys to params
  if (moveRemainingToParams) {
    const extractedKeySet = new Set<string>(extractKeys as string[]);
    const explicitParamKeySet = new Set<string>(paramKeys as string[]);

    Object.keys(originalOptions).forEach((keyName) => {
      if (
        !REQUEST_OPTION_KEYS.has(keyName as RequestOptionsKeys) &&
        !extractedKeySet.has(keyName) &&
        !explicitParamKeySet.has(keyName)
      ) {
        toParams[keyName] = originalOptions[keyName];
      }
    });
  }

  // 3) build requestOptions by merging overwriteOptions over originalOptions
  (["authentication", "portal"] as const).forEach((key) => {
    if (existsIn(originalOptions, key))
      requestOptionsOut[key] = originalOptions[key];
    if (existsIn(overwriteOptionsAs, key))
      requestOptionsOut[key] = overwriteOptionsAs[key];
  });

  (["fetchOptions", "requestFlags"] as const).forEach((key) => {
    if (existsIn(originalOptions, key) || existsIn(overwriteOptionsAs, key)) {
      requestOptionsOut[key] = {
        ...(originalOptions[key] ?? {}),
        ...(overwriteOptionsAs[key] ?? {})
      };
    }
  });

  /**
   * if original options has a params object,
   * or if any top-level options keys were delegated to become params,
   * merge them all into requestOptions.params.
   */
  if (existsIn(originalOptions, "params") || Object.keys(toParams).length > 0) {
    requestOptionsOut.params = {
      ...(originalOptions.params ?? {}),
      ...toParams
    };
  }

  return {
    ...(toExtract as Partial<Pick<T, ExtractableKey<T>>>),
    requestOptions: requestOptionsOut as Partial<PureRequestOptions>
  };
}
