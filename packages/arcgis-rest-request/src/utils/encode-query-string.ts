/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { processParams } from "./process-params";

/**
 * Encodes keys and parameters for use in a URL's query string.
 *
 * @param key Parameter's key
 * @param value Parameter's value
 * @returns Query string with key and value pairs separated by "&"
 */
export function encodeParam(key: string, value: any): string {
  // For array of arrays, repeat key=value for each element of containing array
  if (Array.isArray(value) && value[0] && Array.isArray(value[0])) {
    return value.map((arrayElem: string) => encodeParam(key, arrayElem)).join("&");
  }

  return encodeURIComponent(key) + "=" + encodeURIComponent(value);
}

/**
 * Encodes the passed object as a query string.
 *
 * @param params An object to be encoded.
 * @returns An encoded query string.
 */
export function encodeQueryString(params: any): string {
  const newParams = processParams(params);
  return Object.keys(newParams)
    .map((key: any) => {
      return encodeParam(key, newParams[key]);
    })
    .join("&");
}
