/* Copyright (c) 2026 Environmental Systems Research Institute, Inc. */

import { ILegacyRequestOptions, IRequestOptions } from "./IRequestOptions.js";

// using PureRequestOptions to explicitly only support v5 requestOptions until legacy requestOptions are removed from IRequestOptions
type PureRequestOptions = Omit<IRequestOptions, keyof ILegacyRequestOptions>;

// using ExtractableKey to explicitly define that only non-IRequestOptions keys can be extracted to help avoid duplicate exports in props
type ExtractableKey<T extends IRequestOptions> = Exclude<
  keyof T,
  keyof IRequestOptions
>;

type ProcessOptionsResult<
  T extends IRequestOptions,
  ToExtractKeys extends readonly ExtractableKey<T>[]
> = {
  requestOptions: IRequestOptions;
} & Partial<Pick<T, ToExtractKeys[number]>>;

interface ProcessOptionsConfig<
  T extends IRequestOptions,
  ToExtractKeys extends readonly ExtractableKey<T>[]
> {
  paramKeys: Array<ExtractableKey<T>>;
  extractKeys: ToExtractKeys;
  // Fallback values used only when the corresponding value is not provided in options.
  defaultOptions?: Partial<PureRequestOptions>;
}

export function processOptions<
  T extends IRequestOptions,
  const ToExtractKeys extends readonly ExtractableKey<T>[]
>(
  options: T,
  optionsConfig: ProcessOptionsConfig<T, ToExtractKeys>
): ProcessOptionsResult<T, ToExtractKeys> {
  const { paramKeys, extractKeys, defaultOptions } = optionsConfig;

  const requestOptionsOut: IRequestOptions = {};
  const defaultOptionsAs: Partial<PureRequestOptions> = defaultOptions ?? {};
  const toParams: Record<string, any> = {};
  const toExtract: Partial<Pick<T, ToExtractKeys[number]>> = {};

  const existsIn = <O extends object>(
    obj: O,
    key: PropertyKey
  ): key is keyof O => Object.prototype.hasOwnProperty.call(obj, key);

  const REQUEST_OPTION_KEYS = new Set<string>([
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

  const assignDefaultIfPresent = <K extends keyof PureRequestOptions>(
    key: K
  ) => {
    if (existsIn(defaultOptionsAs, key)) {
      requestOptionsOut[key] = defaultOptionsAs[key];
    }
  };

  const assignOptionIfPresent = <K extends keyof IRequestOptions>(key: K) => {
    if (existsIn(options, key)) {
      requestOptionsOut[key] = options[key];
    }
  };

  // a) move non-request-option paramkeys into params bucket
  paramKeys.forEach((key) => {
    const keyName = key as string;
    if (
      existsIn(options, key) &&
      // requestOptions keys should not be able to be added to paramKeys, enforce here
      !REQUEST_OPTION_KEYS.has(keyName)
    ) {
      toParams[keyName] = options[key];
    }
  });

  // b) move all keys to extract into extract bucket
  extractKeys.forEach((key) => {
    if (existsIn(options, key)) {
      toExtract[key] = options[key];
    }
  });

  // 1) build requestOptions by applying default options first, then override with any existing option values.
  // start with top-level keys, then fetchOptions and requestFlags objects.
  (["authentication", "portal"] as const).forEach((key) => {
    assignDefaultIfPresent(key);
    assignOptionIfPresent(key);
  });

  (["fetchOptions", "requestFlags"] as const).forEach((key) => {
    if (existsIn(options, key) || existsIn(defaultOptionsAs, key)) {
      requestOptionsOut[key] = {
        ...(defaultOptionsAs[key] ?? {}),
        ...(options[key] ?? {})
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
  ).forEach(assignOptionIfPresent);

  /**
   * if original options has a params object,
   * or if any top-level options keys were delegated to become params,
   * merge them all into requestOptions.params.
   */
  if (
    existsIn(defaultOptionsAs, "params") ||
    existsIn(options, "params") ||
    Object.keys(toParams).length > 0
  ) {
    requestOptionsOut.params = {
      ...(defaultOptionsAs.params ?? {}),
      ...(options.params ?? {}),
      ...toParams
    };
  }

  return {
    ...toExtract,
    requestOptions: requestOptionsOut
  };
}
