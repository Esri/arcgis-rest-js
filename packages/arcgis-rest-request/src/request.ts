/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { checkForErrors } from "./utils/check-for-errors";
import { encodeFormData } from "./utils/encode-form-data";
import { encodeQueryString } from "./utils/encode-query-string";

export interface IAuthenticationManager {
  getToken(url: string): Promise<string>;
}

/**
 * HTTP methods used by the ArcGIS REST API.
 */
export type HTTPMethods = "GET" | "POST";

/**
 * Valid response formats for the `f` parameter.
 */
export type ResponseFormats =
  | "json"
  | "geojson"
  | "text"
  | "html"
  | "image"
  | "zip";

export interface IParams {
  f?: ResponseFormats;
  [key: string]: any;
}

/**
 * Options for the [`request()`](/api/arcgis-core/request/) method.
 */
export interface IRequestOptions {
  /**
   * The HTTP method to send the request with.
   */
  httpMethod?: HTTPMethods;

  /**
   * The instance of `IAuthenticationManager` to use to authenticate this request.
   */
  authentication?: IAuthenticationManager;

  /**
   * The implementation of `fetch` to use. Defaults to a global `fetch`
   */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
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
  requestParams: IParams = { f: "json" },
  requestOptions?: IRequestOptions
): Promise<any> {
  const options: IRequestOptions = {
    ...{ httpMethod: "POST", fetch: fetch.bind(Function("return this")()) },
    ...requestOptions
  };

  const { httpMethod, authentication } = options;

  const params: IParams = {
    ...{ f: "json" },
    ...requestParams
  };

  const fetchOptions: RequestInit = {
    method: httpMethod
  };

  return (authentication ? authentication.getToken(url) : Promise.resolve(""))
    .then(token => {
      if (token.length) {
        params.token = token;
      }

      if (httpMethod === "GET") {
        url = url + "?" + encodeQueryString(params);
      }

      if (httpMethod === "POST") {
        fetchOptions.body = encodeFormData(params);
      }

      return options.fetch(url, fetchOptions);
    })
    .then(response => {
      switch (params.f) {
        case "json":
          return response.json();
        case "geojson":
          return response.json();
        case "html":
          return response.text();
        case "text":
          return response.text();
        /* istanbul ignore next blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
        case "image":
          return response.blob();
        /* istanbul ignore next blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
        case "zip":
          return response.blob();
      }
    })
    .then(data => {
      if (params.f === "json" || params.f === "geojson") {
        return checkForErrors(data, url, params, options);
      } else {
        return data;
      }
    });
}
