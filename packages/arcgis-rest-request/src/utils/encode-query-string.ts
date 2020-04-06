/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { processParams } from "./process-params";

export function encodeParam(key: string, value: any) {
   // Check for and handle `categories` parameter to match API expectation for AND and OR
   // @see https://developers.arcgis.com/rest/users-groups-and-items/search.htm
   // @see https://developers.arcgis.com/rest/users-groups-and-items/group-content-search.htm
   if (key === "categories") {
     return value.map(
       (categoryGroup: string) => {
         return encodeURIComponent(key) + "=" + encodeURIComponent(categoryGroup);
       }
     )
     .join("&");
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
