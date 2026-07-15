/* Copyright (c) 2026 Environmental Systems Research Institute, Inc. */

import { ILegacyRequestOptions, IRequestOptions } from "./IRequestOptions.js";

// using PureRequestOptions to explicitly only support v5 requestOptions until legacy requestOptions are removed from IRequestOptions
type PureRequestOptions = Omit<IRequestOptions, keyof ILegacyRequestOptions>;
type RequestOptionsKeys = keyof IRequestOptions;

// using ExtractableKey to explicitly define that only non IRequestOptions keys can be extracted to help avoid duplicate exports in props
type ExtractableKey<T extends IRequestOptions> = Exclude<
  keyof T,
  keyof IRequestOptions
>;

type ProcessOptionsResult<T extends IRequestOptions> = {
  requestOptions: Partial<IRequestOptions>;
} & Partial<Pick<T, ExtractableKey<T>>>;

interface ProcessOptionsConfig<T extends IRequestOptions> {
  paramKeys: Array<ExtractableKey<T>>;
  extractKeys: Array<ExtractableKey<T>>;
  // Fallback values used only when the corresponding value is not provided in options.
  defaultOptions?: Partial<PureRequestOptions>;
}

export function processOptions<T extends IRequestOptions>(
  options: T,
  optionsConfig: ProcessOptionsConfig<T>
): ProcessOptionsResult<T> {
  const { paramKeys, extractKeys, defaultOptions } = optionsConfig;

  // internally redefine types as Record type for parsing and merging
  const originalOptions = options as Record<string, any>;
  const requestOptionsOut: Record<string, any> = {};
  const defaultOptionsAs = (defaultOptions ?? {}) as Record<string, any>;
  const toParams: Record<string, any> = {};
  const toExtract: Record<string, any> = {};

  const existsIn = (obj: Record<string, any>, key: string) =>
    Object.prototype.hasOwnProperty.call(obj, key);

  const REQUEST_OPTION_KEYS = new Set<RequestOptionsKeys>([
    "authentication",
    "portal",
    "fetchOptions",
    "requestFlags",
    "params",
    // legacy request options are passed through to request() where warnings
    // and v5 normalization are handled centrally.
    "httpMethod",
    "credentials",
    "headers",
    "signal",
    "hideToken",
    "suppressWarnings",
    "maxUrlLength",
    "rawResponse"
  ]);

  // a) move non-request-option paramkeys into params bucket
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

  // b) move all keys to extract into extract bucket
  extractKeys.forEach((key) => {
    const keyName = key as string;
    if (existsIn(originalOptions, keyName)) {
      toExtract[keyName] = originalOptions[keyName];
    }
  });

  // 1) build requestOptions by applying default options first, then override with any existing option values.
  // start with top-level keys, then fetchOptions and requestFlags objects.
  (["authentication", "portal"] as const).forEach((key) => {
    if (existsIn(defaultOptionsAs, key))
      requestOptionsOut[key] = defaultOptionsAs[key];
    if (existsIn(originalOptions, key))
      requestOptionsOut[key] = originalOptions[key];
  });

  (["fetchOptions", "requestFlags"] as const).forEach((key) => {
    if (existsIn(originalOptions, key) || existsIn(defaultOptionsAs, key)) {
      requestOptionsOut[key] = {
        ...(defaultOptionsAs[key] ?? {}),
        ...(originalOptions[key] ?? {})
      };
    }
  });

  // 2) pass through any legacy top-level request options from original options.
  // request() can emit warnings and convert them to v5 shape in one place.
  // Legacy defaults are intentionally not allowed in defaultOptions.
  (
    [
      "httpMethod",
      "credentials",
      "headers",
      "signal",
      "hideToken",
      "suppressWarnings",
      "maxUrlLength",
      "rawResponse"
    ] as const
  ).forEach((key) => {
    // this will only pass through legacy request options from the original options.
    // default options will not allow legacy request options to be introduced
    if (existsIn(originalOptions, key)) {
      requestOptionsOut[key] = originalOptions[key];
    }
  });

  /**
   * if original options has a params object,
   * or if any top-level options keys were delegated to become params,
   * merge them all into requestOptions.params.
   */
  if (
    existsIn(defaultOptionsAs, "params") ||
    existsIn(originalOptions, "params") ||
    Object.keys(toParams).length > 0
  ) {
    requestOptionsOut.params = {
      ...(defaultOptionsAs.params ?? {}),
      ...(originalOptions.params ?? {}),
      ...toParams
    };
  }

  return {
    ...(toExtract as Partial<Pick<T, ExtractableKey<T>>>),
    requestOptions: requestOptionsOut as Partial<IRequestOptions>
  };
}
