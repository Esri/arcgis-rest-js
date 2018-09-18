/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { checkForErrors } from "./utils/check-for-errors";
import { encodeFormData } from "./utils/encode-form-data";
import { encodeQueryString } from "./utils/encode-query-string";
import { requiresFormData } from "./utils/process-params";
import { ArcGISRequestError } from "./utils/ArcGISRequestError";

export type GrantTypes =
  | "authorization_code"
  | "refresh_token"
  | "client_credentials"
  | "exchange_refresh_token";

export interface IParams {
  f?: ResponseFormats;
  [key: string]: any;
}

export interface IGenerateTokenParams extends IParams {
  username?: string;
  password?: string;
  expiration?: number;
  token?: string;
  serverUrl?: string;
}

export interface IFetchTokenParams extends IParams {
  client_id: string;
  client_secret?: string;
  grant_type: GrantTypes;
  redirect_uri?: string;
  refresh_token?: string;
  code?: string;
}

export interface ITokenRequestOptions {
  params?: IGenerateTokenParams | IFetchTokenParams;
  httpMethod?: HTTPMethods;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

/**
 * Authentication can be supplied to `request` via [`UserSession`](../../auth/UserSession/) or [`ApplicationSession`](../../auth/ApplicationSession/). Both classes extend `IAuthenticationManager`.
 * ```js
 * const session = new UserSession({
 *   username: "jsmith",
 *   password: "123456",
 *   // optional
 *   portal: "https://[yourserver]/arcgis/sharing/rest"
 * })
 *
 * request(url, { authentication: session })
 * ```
 */
export interface IAuthenticationManager {
  /**
   * Defaults to 'https://www.arcgis.com/sharing/rest'.
   */
  portal: string;
  getToken(url: string, requestOptions?: ITokenRequestOptions): Promise<string>;
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

/**
 * Options for the `request()` method.
 */
export interface IRequestOptions {
  /**
   * Additional parameters to pass in the request.
   */
  params?: IParams;

  /**
   * The HTTP method to send the request with.
   */
  httpMethod?: HTTPMethods;

  /**
   * The instance of `IAuthenticationManager` to use to authenticate this request.
   */
  authentication?: IAuthenticationManager;

  /**
   * Base url for the portal you want to make the request to. Defaults to 'https://www.arcgis.com/sharing/rest'.
   */
  portal?: string;

  /**
   * The implementation of `fetch` to use. Defaults to a global `fetch`.
   */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;

  /**
   * If the length of a GET request's URL exceeds `maxUrlLength` the request will use POST instead.
   */
  maxUrlLength?: number;
}

/**
 * Generic method for making HTTP requests to ArcGIS REST API endpoints.
 *
 * ```js
 * import { request } from '@esri/arcgis-rest-request';
 *
 * request('https://www.arcgis.com/sharing/rest')
 *   .then((response) => {
 *     console.log(response.currentVersion); // => 5.2
 *   });
 * ```
 *
 * ```js
 * import { request, HTTPMethods } from '@esri/arcgis-rest-request';
 *
 * request('https://www.arcgis.com/sharing/rest', {
 *   httpMethod: "GET"
 * }).then((response) => {
 *   console.log(response.currentVersion); // => 5.2
 * });
 * ```
 *
 * ```js
 * import { request, HTTPMethods } from '@esri/arcgis-rest-request';
 *
 * request('https://www.arcgis.com/sharing/rest/search', {
 *   params: { q: 'parks' }
 * }).then((response) => {
 *   console.log(response.total); // => 78379
 * });
 * ```
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param requestOptions - Options for the request, including parameters relevant to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function request(
  url: string,
  requestOptions: IRequestOptions = { params: { f: "json" } }
): Promise<any> {
  const options: IRequestOptions = {
    httpMethod: "POST",
    ...requestOptions
  };

  const missingGlobals: string[] = [];
  const recommendedPackages: string[] = [];

  // don't check for a global fetch if a custom implementation was passed through
  if (!options.fetch && typeof fetch !== "undefined") {
    options.fetch = fetch.bind(Function("return this")());
  } else {
    missingGlobals.push("`fetch`");
    recommendedPackages.push("`isomorphic-fetch`");
  }

  if (typeof Promise === "undefined") {
    missingGlobals.push("`Promise`");
    recommendedPackages.push("`es6-promise`");
  }

  if (typeof FormData === "undefined") {
    missingGlobals.push("`FormData`");
    recommendedPackages.push("`isomorphic-form-data`");
  }

  if (
    !options.fetch ||
    typeof Promise === "undefined" ||
    typeof FormData === "undefined"
  ) {
    throw new Error(
      `\`arcgis-rest-request\` requires global variables for \`fetch\`, \`Promise\` and \`FormData\` to be present in the global scope. You are missing ${missingGlobals.join(
        ", "
      )}. We recommend installing the ${recommendedPackages.join(
        ", "
      )} modules at the root of your application to add these to the global scope. See https://bit.ly/2KNwWaJ for more info.`
    );
  }

  const { httpMethod, authentication } = options;

  const params: IParams = {
    ...{ f: "json" },
    ...requestOptions.params
  };

  const fetchOptions: RequestInit = {
    method: httpMethod,
    // ensures behavior mimics XMLHttpRequest. needed to support sending IWA cookies
    credentials: "same-origin"
  };

  return (authentication
    ? authentication.getToken(url, {
        fetch: options.fetch
      })
    : Promise.resolve("")
  )
    .then(token => {
      if (token.length) {
        params.token = token;
      }

      if (fetchOptions.method === "GET") {
        // encode the parameters into the query string
        const queryParams = encodeQueryString(params);
        // dont append a '?' unless parameters are actually present
        const urlWithQueryString =
          queryParams === "" ? url : url + "?" + encodeQueryString(params);

        if (
          options.maxUrlLength &&
          urlWithQueryString.length > options.maxUrlLength
        ) {
          // the consumer specified a maximum length for URLs
          // and this would exceed it, so use post instead
          fetchOptions.method = "POST";
        } else {
          // just use GET
          url = urlWithQueryString;
        }
      }

      if (fetchOptions.method === "POST") {
        fetchOptions.body = encodeFormData(params);
      }

      /* istanbul ignore else blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
      if (!requiresFormData(params)) {
        fetchOptions.headers = {};
        fetchOptions.headers["Content-Type"] =
          "application/x-www-form-urlencoded";
      }

      return options.fetch(url, fetchOptions);
    })
    .then(response => {
      if (!response.ok) {
        // server responded w/ an actual error (404, 500, etc)
        const { status, statusText } = response;
        throw new ArcGISRequestError(
          statusText,
          `HTTP ${status}`,
          response,
          url,
          options
        );
      }
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
        /* istanbul ignore next */
        case "zip":
          return response.blob();
        /* istanbul ignore next */
        default:
          // hopefully we never need to handle JSON payloads when no f= parameter is set
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
