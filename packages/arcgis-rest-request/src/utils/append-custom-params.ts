/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";
import { normalizeRequestOptions } from "./normalize-request-options.js";

/**
 * Appends selected custom option keys into `params` while preserving request options.
 *
 * This utility exists to support endpoint helper methods that accept many first-order options.
 * It is maintained for backwards compatibility while endpoint helpers transition to clearer,
 * explicit request options over time.
 *
 * @param customOptions Endpoint-specific options supplied by the caller.
 * @param keys Keys from `customOptions` that should be appended to `params`.
 * @param baseOptions Request defaults merged before `customOptions`.
 * @return IRequestOptions object with custom options appended to `params`, and all other custom options removed that are not part of IRequestOptions.
 */
export function appendCustomParams<T extends IRequestOptions>(
  customOptions: T,
  keys: Array<keyof T>,
  baseOptions?: Partial<T>
): IRequestOptions {
  // NOTE: this must be kept in sync with the keys in IRequestOptions
  const requestOptionsKeys = [
    // request options
    "params",
    "authentication",
    "requestFlags",
    "fetchOptions",
    "portal",
    // legacy options
    "suppressWarnings",
    "hideToken",
    "httpMethod",
    "credentials",
    "headers",
    "signal",
    "maxUrlLength",
    "rawResponse"
  ];

  const options: T = {
    ...{ params: {} },
    ...baseOptions,
    ...customOptions
  };

  // merge all keys in customOptions into options.params
  options.params = keys.reduce((value, key) => {
    if (
      customOptions[key] ||
      typeof customOptions[key] === "boolean" ||
      (typeof customOptions[key] === "number" &&
        (customOptions[key] as unknown) === 0)
    ) {
      value[key as any] = customOptions[key];
    }
    return value;
  }, options.params);

  // now remove all properties in options that don't exist in IRequestOptions
  const requestOptions = requestOptionsKeys.reduce((value, key) => {
    if ((options as any)[key]) {
      (value as any)[key] = (options as any)[key];
    }
    return value;
  }, {} as IRequestOptions);

  // Normalize legacy top-level options into requestFlags/fetchOptions.
  return normalizeRequestOptions(requestOptions);
}
