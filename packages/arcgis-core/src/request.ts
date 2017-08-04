import "es6-promise/auto";
import "isomorphic-fetch";
import { checkForErrors } from "./utils/check-for-errors";
import { encodeFormData, FormData } from "./utils/encode-form-data";
import {
  encodeQueryString,
  URLSearchParams
} from "./utils/encode-query-string";

export { FormData };
export { URLSearchParams };

/**
 * HTTP methods used by the ArcGIS REST API.
 */
export type HTTPMethods = "GET" | "POST";

/**
 * Options for the [`request()`](/api/arcgis-core/request/) method.
 */
export interface IRequestOptions {
  /**
   * The HTTP method to send the request with.
   */
  httpMethod?: HTTPMethods;
}

/**
 * Generic method for making HTTP requests to ArcGIS REST API endpoints.
 *
 * ```js
 * import { request } from 'arcgis-core';
 *
 * request('https://www.arcgis.com/sharing/rest')
 *   .then((response) => {
 *     console.log(response.currentVersion); // => 5.2
 *   });
 * ```
 *
 * ```js
 * import { request, HTTPMethods } from 'arcgis-core';
 *
 * request('https://www.arcgis.com/sharing/rest', {}, {
 *   httpMethod: "GET"
 * }).then((response) => {
 *   console.log(response.currentVersion); // => 5.2
 * });
 * ```
 *
 * ```js
 * import { request, HTTPMethods } from 'arcgis-core';
 *
 * request('https://www.arcgis.com/sharing/rest/search', {
 *   q: 'parks'
 * }).then((response) => {
 *   console.log(response.total); // => 78379
 * });
 * ```
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param params - The parameters to pass to the endpoint.
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the request.
 */
export function request(
  url: string,
  params: any = {},
  requestOptions?: IRequestOptions
): Promise<any> {
  const { httpMethod }: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };

  if (!params.f) {
    params.f = "json";
  }

  const options: RequestInit = {
    method: httpMethod
  };

  if (httpMethod === "GET") {
    url = url + "?" + encodeQueryString(params).toString();
  }

  if (httpMethod === "POST") {
    options.body = encodeFormData(params);
  }

  return fetch(url, options)
    .then(response => {
      switch (params.f) {
        case "json":
          return response.json();
        case "image":
          return response.blob();
        case "html":
          return response.text();
        case "text":
          return response.text();
        case "zip":
          return response.blob();
        default:
          return response.text();
      }
    })
    .then(data => {
      if (params.f === "json") {
        checkForErrors(data);
        return data;
      } else {
        return data;
      }
    });
}
