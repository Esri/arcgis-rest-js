/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Helper for methods with lots of first order request options to pass through as request parameters.
 */
export function appendCustomParams<T extends IRequestOptions>(
  customOptions: T,
  keys: Array<keyof T>,
  baseOptions?: Partial<T>
): IRequestOptions {
  const requestOptionsKeys = [
    "params",
    "httpMethod",
    "rawResponse",
    "authentication",
    "portal",
    "fetch",
    "maxUrlLength",
    "headers"
  ];

  const options: T = {
    ...{ params: {} },
    ...baseOptions,
    ...customOptions
  };

  // merge all keys in customOptions into options.params
  options.params = keys.reduce((value, key) => {
    value[key as any] = customOptions[key];
    return value;
  }, options.params);

  // now remove all properties in options that don't exist in IRequestOptions
  return requestOptionsKeys.reduce(
    (value, key) => {
      if (options[key]) {
        value[key] = options[key];
      }
      return value;
    },
    {} as IRequestOptions
  );
}
