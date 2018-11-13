/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeFormData } from "./utils/encode-form-data";
import { encodeQueryString } from "./utils/encode-query-string";
import { requiresFormData } from "./utils/process-params";
import { ArcGISRequestError } from "./utils/ArcGISRequestError";
import { IRetryAuthError } from "./utils/retryAuthError";
import { HTTPMethods, IParams, ITokenRequestOptions } from "./utils/params";

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

export class ArcGISAuthError extends ArcGISRequestError {
  /**
   * Create a new `ArcGISAuthError`  object.
   *
   * @param message - The error message from the API
   * @param code - The error code from the API
   * @param response - The original response from the API that caused the error
   * @param url - The original url of the request
   * @param options - The original options of the request
   */
  constructor(
    message = "AUTHENTICATION_ERROR",
    code: string | number = "AUTHENTICATION_ERROR_CODE",
    response?: any,
    url?: string,
    options?: IRequestOptions
  ) {
    super(message, code, response, url, options);
    this.name = "ArcGISAuthError";
    this.message =
      code === "AUTHENTICATION_ERROR_CODE" ? message : `${code}: ${message}`;
  }

  retry(getSession: IRetryAuthError, retryLimit = 3) {
    let tries = 0;

    const retryRequest = (resolve: any, reject: any) => {
      getSession(this.url, this.options)
        .then(session => {
          const newOptions = {
            ...this.options,
            ...{ authentication: session }
          };

          tries = tries + 1;
          return request(this.url, newOptions);
        })
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          if (e.name === "ArcGISAuthError" && tries < retryLimit) {
            retryRequest(resolve, reject);
          } else if (e.name === "ArcGISAuthError" && tries >= retryLimit) {
            reject(this);
          } else {
            reject(e);
          }
        });
    };

    return new Promise((resolve, reject) => {
      retryRequest(resolve, reject);
    });
  }
}

/**
 * Checks for errors in a JSON response from the ArcGIS REST API. If there are no errors, it will return the `data` passed in. If there is an error, it will throw an `ArcGISRequestError` or `ArcGISAuthError`.
 *
 * @param data The response JSON to check for errors.
 * @param url The url of the original request
 * @param params The parameters of the original request
 * @param options The options of the original request
 * @returns The data that was passed in the `data` parameter
 */
export function checkForErrors(
  response: any,
  url?: string,
  params?: IParams,
  options?: IRequestOptions
): any {
  // this is an error message from billing.arcgis.com backend
  if (response.code >= 400) {
    const { message, code } = response;
    throw new ArcGISRequestError(message, code, response, url, options);
  }

  // error from ArcGIS Online or an ArcGIS Portal or server instance.
  if (response.error) {
    const { message, code, messageCode } = response.error;
    const errorCode = messageCode || code || "UNKNOWN_ERROR_CODE";

    if (code === 498 || code === 499 || messageCode === "GWM_0003") {
      throw new ArcGISAuthError(message, errorCode, response, url, options);
    }

    throw new ArcGISRequestError(message, errorCode, response, url, options);
  }

  // error from a status check
  if (response.status === "failed" || response.status === "failure") {
    let message: string;
    let code: string = "UNKNOWN_ERROR_CODE";

    try {
      message = JSON.parse(response.statusMessage).message;
      code = JSON.parse(response.statusMessage).code;
    } catch (e) {
      message = response.statusMessage || response.message;
    }

    throw new ArcGISRequestError(message, code, response, url, options);
  }

  return response;
}
