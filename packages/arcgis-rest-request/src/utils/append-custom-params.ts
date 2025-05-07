/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";

/**
 * Helper for methods with lots of first order request options to pass through as request parameters.
 */
export function appendCustomParams<T extends IRequestOptions>(
  customOptions: T,
  keys: Array<keyof T>,
  baseOptions?: Partial<T>
): IRequestOptions {
  // NOTE: this must be kept in sync with the keys in IRequestOptions
  const requestOptionsKeys = [
    "params",
    "httpMethod",
    "rawResponse",
    "authentication",
    "hideToken",
    "portal",
    "credentials",
    "maxUrlLength",
    "headers",
    "signal",
    "suppressWarnings",
    "request"
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
  return requestOptionsKeys.reduce((value, key) => {
    if ((options as any)[key]) {
      (value as any)[key] = (options as any)[key];
    }
    return value;
  }, {} as IRequestOptions);
}
