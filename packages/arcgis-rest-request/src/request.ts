/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeFormData } from "./utils/encode-form-data";
import { encodeQueryString } from "./utils/encode-query-string";
import { requiresFormData } from "./utils/process-params";
import { ArcGISRequestError } from "./utils/ArcGISRequestError";
import { IRequestOptions } from "./utils/IRequestOptions";
import { IParams } from "./utils/IParams";
import { warn } from "./utils/warn";
import { IRetryAuthError } from "./utils/retryAuthError";
import {
  isNoCorsDomain,
  isNoCorsRequestRequired,
  registerNoCorsDomains,
  sendNoCorsRequest,
} from "./utils/sendNoCorsRequest";
import { isSameOrigin } from "./utils/isSameOrigin";

export const NODEJS_DEFAULT_REFERER_HEADER = `@esri/arcgis-rest-js`;

let DEFAULT_ARCGIS_REQUEST_OPTIONS: IRequestOptions = {
  httpMethod: "POST",
  params: {
    f: "json",
  },
};

/**
 * Sets the default options that will be passed in **all requests across all `@esri/arcgis-rest-js` modules**.
 *
 *
 * ```js
 * import { setDefaultRequestOptions } from "@esri/arcgis-rest-request";
 * setDefaultRequestOptions({
 *   authentication: userSession // all requests will use this session by default
 * })
 * ```
 * You should **never** set a default `authentication` when you are in a server side environment where you may be handling requests for many different authenticated users.
 *
 * @param options The default options to pass with every request. Existing default will be overwritten.
 * @param hideWarnings Silence warnings about setting default `authentication` in shared environments.
 */
export function setDefaultRequestOptions(
  options: typeof DEFAULT_ARCGIS_REQUEST_OPTIONS,
  hideWarnings?: boolean
) {
  if (options.authentication && !hideWarnings) {
    warn(
      "You should not set `authentication` as a default in a shared environment such as a web server which will process multiple users requests. You can call `setDefaultRequestOptions` with `true` as a second argument to disable this warning."
    );
  }
  DEFAULT_ARCGIS_REQUEST_OPTIONS = options;
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

  public retry(getSession: IRetryAuthError, retryLimit = 3) {
    let tries = 0;

    const retryRequest = (resolve: any, reject: any) => {
      getSession(this.url, this.options)
        .then((session) => {
          const newOptions = {
            ...this.options,
            ...{ authentication: session },
          };

          tries = tries + 1;
          return request(this.url, newOptions);
        })
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
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
  options?: IRequestOptions,
  originalAuthError?: ArcGISAuthError
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

    if (
      code === 498 ||
      code === 499 ||
      messageCode === "GWM_0003" ||
      (code === 400 && message === "Unable to generate token.")
    ) {
      if (originalAuthError) {
        throw originalAuthError;
      } else {
        throw new ArcGISAuthError(message, errorCode, response, url, options);
      }
    }

    throw new ArcGISRequestError(message, errorCode, response, url, options);
  }

  // error from a status check
  if (response.status === "failed" || response.status === "failure") {
    let message: string;
    let code = "UNKNOWN_ERROR_CODE";

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

/**
 * ```js
 * import { request } from '@esri/arcgis-rest-request';
 * //
 * request('https://www.arcgis.com/sharing/rest')
 *   .then(response) // response.currentVersion === 5.2
 * //
 * request('https://www.arcgis.com/sharing/rest', {
 *   httpMethod: "GET"
 * })
 * //
 * request('https://www.arcgis.com/sharing/rest/search', {
 *   params: { q: 'parks' }
 * })
 *   .then(response) // response.total => 78379
 * ```
 * Generic method for making HTTP requests to ArcGIS REST API endpoints.
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
    ...{ httpMethod: "POST" },
    ...DEFAULT_ARCGIS_REQUEST_OPTIONS,
    ...requestOptions,
    ...{
      params: {
        ...DEFAULT_ARCGIS_REQUEST_OPTIONS.params,
        ...requestOptions.params,
      },
      headers: {
        ...DEFAULT_ARCGIS_REQUEST_OPTIONS.headers,
        ...requestOptions.headers,
      },
    },
  };

  const missingGlobals: string[] = [];
  const recommendedPackages: string[] = [];

  // don't check for a global fetch if a custom implementation was passed through
  if (!options.fetch && typeof fetch !== "undefined") {
    options.fetch = fetch.bind(Function("return this")());
  } else {
    missingGlobals.push("`fetch`");
    recommendedPackages.push("`node-fetch`");
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
      `\`arcgis-rest-request\` requires a \`fetch\` implementation and global variables for \`Promise\` and \`FormData\` to be present in the global scope. You are missing ${missingGlobals.join(
        ", "
      )}. We recommend installing the ${recommendedPackages.join(
        ", "
      )} modules at the root of your application to add these to the global scope. See https://bit.ly/2KNwWaJ for more info.`
    );
  }

  const { httpMethod, authentication, rawResponse } = options;

  const params: IParams = {
    ...{ f: "json" },
    ...options.params,
  };

  let originalAuthError: ArcGISAuthError = null;

  const fetchOptions: RequestInit = {
    method: httpMethod,
    /* ensures behavior mimics XMLHttpRequest.
    needed to support sending IWA cookies */
    credentials: options.credentials || "same-origin",
  };

  // Is this a no-cors domain? if so we need to set credentials to include
  if (isNoCorsDomain(url)) {
    fetchOptions.credentials = "include";
  }

  // Check if a no-cors request is required. Just because it's a no-cors domain
  // does not mean we need to make a no-cors request. Internally we track requests
  // and only send them once an hour.
  // Additionally we never need to send a no-cors request for same-origin requests

  // default to false, for nodejs
  let sameOrigin = false;
  // if we are in a browser, check if the url is same origin
  /* istanbul ignore else */
  if (window) {
    sameOrigin = isSameOrigin(url);
  }
  const requiresNoCors = !sameOrigin && isNoCorsRequestRequired(url);

  // the /oauth2/platformSelf route will add X-Esri-Auth-Client-Id header
  // and that request needs to send cookies cross domain
  // so we need to set the credentials to "include"
  if (
    options.headers &&
    options.headers["X-Esri-Auth-Client-Id"] &&
    url.indexOf("/oauth2/platformSelf") > -1
  ) {
    fetchOptions.credentials = "include";
  }

  // TODO: Feels like  we should start w/ the noCors request if needed, THEN do the getToken
  let firstPromise = Promise.resolve();
  if (requiresNoCors) {
    // ensure we send cookies on the request after
    fetchOptions.credentials = "include";
    firstPromise = sendNoCorsRequest(url);
  }

  return firstPromise
    .then(() => {
      if (authentication) {
        return authentication
          .getToken(url, { fetch: options.fetch })
          .catch((err) => {
            /**
             * append original request url and requestOptions
             * to the error thrown by getToken()
             * to assist with retrying
             */
            err.url = url;
            err.options = options;
            /**
             * if an attempt is made to talk to an unfederated server
             * first try the request anonymously. if a 'token required'
             * error is thrown, throw the UNFEDERATED error then.
             */
            originalAuthError = err;
            return Promise.resolve("");
          });
      } else {
        return Promise.resolve("");
      }
    })
    .then((token) => {
      if (token.length) {
        params.token = token;
      }

      if (authentication && authentication.getDomainCredentials) {
        fetchOptions.credentials = authentication.getDomainCredentials(url);
      }

      // Custom headers to add to request. IRequestOptions.headers with merge over requestHeaders.
      const requestHeaders: {
        [key: string]: any;
      } = {};

      if (fetchOptions.method === "GET") {
        // Prevents token from being passed in query params when hideToken option is used.
        /* istanbul ignore if - window is always defined in a browser. Test case is covered by Jasmine in node test */
        if (
          params.token &&
          options.hideToken &&
          // Sharing API does not support preflight check required by modern browsers https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
          typeof window === "undefined"
        ) {
          requestHeaders["X-Esri-Authorization"] = `Bearer ${params.token}`;
          delete params.token;
        }
        // encode the parameters into the query string
        const queryParams = encodeQueryString(params);
        // dont append a '?' unless parameters are actually present
        const urlWithQueryString =
          queryParams === "" ? url : url + "?" + encodeQueryString(params);

        if (
          // This would exceed the maximum length for URLs specified by the consumer and requires POST
          (options.maxUrlLength &&
            urlWithQueryString.length > options.maxUrlLength) ||
          // Or if the customer requires the token to be hidden and it has not already been hidden in the header (for browsers)
          (params.token && options.hideToken)
        ) {
          // the consumer specified a maximum length for URLs
          // and this would exceed it, so use post instead
          fetchOptions.method = "POST";

          // If the token was already added as a Auth header, add the token back to body with other params instead of header
          if (token.length && options.hideToken) {
            params.token = token;
            // Remove existing header that was added before url query length was checked
            delete requestHeaders["X-Esri-Authorization"];
          }
        } else {
          // just use GET
          url = urlWithQueryString;
        }
      }

      /* updateResources currently requires FormData even when the input parameters dont warrant it.
  https://developers.arcgis.com/rest/users-groups-and-items/update-resources.htm
      see https://github.com/Esri/arcgis-rest-js/pull/500 for more info. */
      const forceFormData = new RegExp("/items/.+/updateResources").test(url);

      if (fetchOptions.method === "POST") {
        fetchOptions.body = encodeFormData(params, forceFormData);
      }

      // Mixin headers from request options
      fetchOptions.headers = {
        ...requestHeaders,
        ...options.headers,
      };

      /* istanbul ignore next - karma reports coverage on browser tests only */
      if (typeof window === "undefined" && !fetchOptions.headers.referer) {
        fetchOptions.headers.referer = NODEJS_DEFAULT_REFERER_HEADER;
      }

      /* istanbul ignore else blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
      if (!requiresFormData(params) && !forceFormData) {
        fetchOptions.headers["Content-Type"] =
          "application/x-www-form-urlencoded";
      }

      return options.fetch(url, fetchOptions);
    })
    .then((response) => {
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
      if (rawResponse) {
        return response;
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
        /* istanbul ignore next blob responses are difficult to make cross platform we will just have to trust that isomorphic fetch will do its job */
        default:
          return response.blob();
      }
    })
    .then((data) => {
      if ((params.f === "json" || params.f === "geojson") && !rawResponse) {
        const response = checkForErrors(
          data,
          url,
          params,
          options,
          originalAuthError
        );

        // If this was a portal/self call, and we got authorizedNoCorsDomains back
        // register them
        if (data && /\/sharing\/rest\/(accounts|portals)\/self/i.test(url)) {
          // if we have a list of no-cors domains, register them
          if (Array.isArray(data.authorizedCrossOriginNoCorsDomains)) {
            registerNoCorsDomains(data.authorizedCrossOriginNoCorsDomains);
          }
        }

        if (originalAuthError) {
          /* If the request was made to an unfederated service that
          didn't require authentication, add the base url and a dummy token
          to the list of trusted servers to avoid another federation check
          in the event of a repeat request */
          const truncatedUrl: string = url
            .toLowerCase()
            .split(/\/rest(\/admin)?\/services\//)[0];

          (options.authentication as any).federatedServers[truncatedUrl] = {
            token: [],
            // default to 24 hours
            expires: new Date(Date.now() + 86400 * 1000),
          };
          originalAuthError = null;
        }
        return response;
      } else {
        return data;
      }
    });
}
