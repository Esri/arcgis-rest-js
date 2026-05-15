/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeFormData } from "./utils/encode-form-data.js";
import { encodeQueryString } from "./utils/encode-query-string.js";
import { requiresFormData } from "./utils/process-params.js";
import { ArcGISRequestError } from "./utils/ArcGISRequestError.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";
import {
  isNoCorsDomain,
  isNoCorsRequestRequired,
  registerNoCorsDomains,
  sendNoCorsRequest
} from "./utils/sendNoCorsRequest.js";
import { IParams } from "./utils/IParams.js";
import { warn } from "./utils/warn.js";
import { warnOnDeprecatedRequestOptions } from "./utils/warn-deprecated-request-options.js";
import { IRetryAuthError } from "./utils/retryAuthError.js";
import { IAuthenticationManager } from "./index.js";
import { isSameOrigin } from "./utils/isSameOrigin.js";
import { normalizeDeprecatedRequestOptions } from "./utils/normalize-deprecated-request-options.js";

export const NODEJS_DEFAULT_REFERER_HEADER = `@esri/arcgis-rest-js`;

/**
 * Sets the default options that will be passed in **all requests across all `@esri/arcgis-rest-js` modules**.
 *
 * ```js
 * import { setDefaultRequestOptions } from "@esri/arcgis-rest-request";
 *
 * setDefaultRequestOptions({
 *   authentication: ArcGISIdentityManager // all requests will use this session by default
 * })
 * ```
 *
 * You should **never** set a default `authentication` when you are in a server side environment where you may be handling requests for many different authenticated users.
 *
 * @deprecated since v4.0.0.
 * @param options The default options to pass with every request. Existing default will be overwritten.
 * @param hideWarnings Silence warnings about setting default `authentication` in shared environments.
 */
export function setDefaultRequestOptions(
  options: IRequestOptions,
  hideWarnings?: boolean
) {
  console.warn(
    `setDefaultRequestOptions() is deprecated. This will be removed in ArcGIS REST JS v5.0.`
  );
  if (options.authentication && !hideWarnings) {
    warn(
      "You should not set `authentication` as a default in a shared environment such as a web server which will process multiple users requests. You can call `setDefaultRequestOptions` with `true` as a second argument to disable this warning."
    );
  }
  (globalThis as any).DEFAULT_ARCGIS_REQUEST_OPTIONS = options;
}

export function getDefaultRequestOptions() {
  return (
    (globalThis as any).DEFAULT_ARCGIS_REQUEST_OPTIONS || {
      httpMethod: "POST",
      params: {
        f: "json"
      }
    }
  );
}

/**
 * This error is thrown when a request encounters an invalid token error. Requests that use {@linkcode ArcGISIdentityManager} or
 * {@linkcode ApplicationCredentialsManager} in the `authentication` option the authentication manager will automatically try to generate
 * a fresh token using either {@linkcode ArcGISIdentityManager.refreshCredentials} or
 * {@linkcode ApplicationCredentialsManager.refreshCredentials}. If the request with the new token fails you will receive an `ArcGISAuthError`
 * if refreshing the token fails you will receive an instance of {@linkcode ArcGISTokenRequestError}.
 *
 * ```js
 * request(someUrl, {
 *   authentication: identityManager,
 *   // some additional options...
 * }).catch(e => {
 *   if(e.name === "ArcGISAuthError") {
 *     console.log("Request with a new token failed you might want to have the user authorize again.")
 *   }
 *
 *   if(e.name === "ArcGISTokenRequestError") {
 *     console.log("There was an error refreshing the token you might want to have the user authorize again.")
 *   }
 * })
 * ```
 */
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

    // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
    // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);
  }

  public retry(getSession: IRetryAuthError, retryLimit = 1) {
    let tries = 0;

    const retryRequest = async (): Promise<any> => {
      tries = tries + 1;

      try {
        const session = await getSession(this.url, this.options);
        const newOptions = {
          ...this.options,
          ...{ authentication: session }
        };

        return await internalRequest(this.url, newOptions);
      } catch (e: any) {
        if (e.name === "ArcGISAuthError" && tries < retryLimit) {
          return retryRequest();
        } else if (
          e.name === this.name &&
          e.message === this.message &&
          tries >= retryLimit
        ) {
          throw this;
        } else {
          throw e;
        }
      }
    };

    return retryRequest();
  }
}

/**
 * Checks for errors in a JSON response from the ArcGIS REST API. If there are no errors, it will return the `data` passed in. If there is an error, it will throw an `ArcGISRequestError` or `ArcGISAuthError`.
 *
 * @param response The response JSON to check for errors.
 * @param url The url of the original request
 * @param params The parameters of the original request
 * @param options The options of the original request
 * @returns The data that was passed in the `data` parameter
 */
export function checkForErrors(
  response: any,
  url?: string,
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

    if (code === 498 || code === 499) {
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

function normalizeRequestOptions(
  requestOptions: IRequestOptions
): IRequestOptions {
  const suppressWarnings =
    requestOptions.requestFlags?.suppressWarnings ??
    requestOptions.suppressWarnings ??
    false;
  warnOnDeprecatedRequestOptions(requestOptions, suppressWarnings);

  const normalizedRequestOptions =
    normalizeDeprecatedRequestOptions(requestOptions);
  const defaults = normalizeDeprecatedRequestOptions(
    getDefaultRequestOptions()
  );

  return {
    ...{ fetchOptions: { method: "POST" } },
    ...defaults,
    ...normalizedRequestOptions,
    ...{
      params: {
        ...defaults.params,
        ...normalizedRequestOptions.params
      },
      requestFlags: {
        ...defaults.requestFlags,
        ...normalizedRequestOptions.requestFlags
      },
      fetchOptions: {
        ...defaults.fetchOptions,
        ...normalizedRequestOptions.fetchOptions,
        headers: {
          ...(defaults.fetchOptions?.headers as any),
          ...(normalizedRequestOptions.fetchOptions?.headers as any)
        }
      }
    }
  };
}

function buildAuthenticationManager(
  options: IRequestOptions
): IAuthenticationManager {
  if (typeof options.authentication !== "string") {
    return options.authentication;
  }

  const rawToken = options.authentication;

  /* istanbul ignore else -- @preserve : we don't need to test NOT warning people */
  if (
    !rawToken.startsWith("AAPK") &&
    !rawToken.startsWith("AAPT") &&
    !rawToken.startsWith("AATK") &&
    !rawToken.startsWith("AAST") &&
    !options.requestFlags?.suppressWarnings &&
    !(globalThis as any).ARCGIS_REST_JS_SUPPRESS_TOKEN_WARNING
  ) {
    warn(
      `Using an oAuth 2.0 access token directly in the token option is discouraged. Consider using ArcGISIdentityManager or Application session. See https://esriurl.com/arcgis-rest-js-direct-token-warning for more information.`
    );
    (globalThis as any).ARCGIS_REST_JS_SUPPRESS_TOKEN_WARNING = true;
  }

  return {
    portal: "https://www.arcgis.com/sharing/rest",
    getToken: () => Promise.resolve(rawToken)
  };
}

async function executeRequest(
  url: string,
  requestOptions: IRequestOptions
): Promise<{
  response: Response;
  url: string;
  originalUrl: string;
  options: IRequestOptions;
  originalAuthError: ArcGISAuthError;
}> {
  const options = normalizeRequestOptions(requestOptions);

  const params: IParams = {
    ...{ f: "json" },
    ...options.params
  };

  const requestFlags = options.requestFlags || {};

  const fetchOptions: RequestInit = {
    ...options.fetchOptions,
    method: options.fetchOptions?.method || "POST",
    /* ensures behavior mimics XMLHttpRequest.
    needed to support sending IWA cookies */
    credentials: options.fetchOptions?.credentials || "same-origin"
  };

  let originalAuthError: ArcGISAuthError = null;

  // Is this a no-cors domain? if so we need to set credentials to include
  if (isNoCorsDomain(url)) {
    fetchOptions.credentials = "include";
  }

  // the /oauth2/platformSelf route will add X-Esri-Auth-Client-Id header
  // and that request needs to send cookies cross domain
  // so we need to set the credentials to "include"
  if (
    fetchOptions.headers &&
    (fetchOptions.headers as any)["X-Esri-Auth-Client-Id"] &&
    url.indexOf("/oauth2/platformSelf") > -1
  ) {
    fetchOptions.credentials = "include";
  }

  const authentication = buildAuthenticationManager(options);

  // for errors in GET requests we want the URL passed to the error to be the URL before
  // query params are applied.
  const originalUrl = url;

  // default to false, for nodejs
  let sameOrigin = false;
  // if we are in a browser, check if the url is same origin
  /* istanbul ignore else -- @preserve */
  if (typeof window !== "undefined") {
    sameOrigin = isSameOrigin(url);
  }
  const requiresNoCors = !sameOrigin && isNoCorsRequestRequired(url);

  // Simple first promise that we may turn into the no-cors request
  if (requiresNoCors) {
    // ensure we send cookies on the request after
    fetchOptions.credentials = "include";
    await sendNoCorsRequest(url);
  }

  let token = "";
  if (authentication) {
    try {
      token = await authentication.getToken(url);
    } catch (err: any) {
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
    }
  }

  if (token.length) {
    params.token = token;
  }

  if (authentication && authentication.getDomainCredentials) {
    fetchOptions.credentials = authentication.getDomainCredentials(url);
  }

  // Custom headers to add to request. IRequestOptions.fetchOptions.headers
  // will merge over these request headers.
  const requestHeaders: {
    [key: string]: any;
  } = {};

  if (fetchOptions.method === "GET") {
    // Prevents token from being passed in query params when hideToken option is used.
    /* istanbul ignore if --@preserve - window is always defined in a browser. Test case is covered by Jasmine in node test */
    if (
      params.token &&
      requestFlags.hideToken &&
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
      queryParams === ""
        ? /* istanbul ignore next -- @preserve */
          url
        : `${url}?${queryParams}`;

    if (
      // This would exceed the default maximum URL length and requires POST,
      // unless the consumer explicitly opts out of this behavior.
      (!requestFlags.ignoreMaxUrlLength && urlWithQueryString.length > 2000) ||
      // Or if the customer requires the token to be hidden and it has not already been hidden in the header (for browsers)
      (params.token && requestFlags.hideToken)
    ) {
      // The request exceeds default URL length handling, so use POST.
      fetchOptions.method = "POST";

      // If the token was already added as a Auth header, add the token back to body with other params instead of header
      if (token.length && requestFlags.hideToken) {
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
    fetchOptions.body = encodeFormData(params, forceFormData) as any;
  }

  // Mixin headers from request options
  fetchOptions.headers = {
    ...requestHeaders,
    ...(fetchOptions.headers as any)
  };

  // This should have the same conditional for Node JS as ArcGISIdentityManager.refreshWithUsernameAndPassword()
  // to ensure that generated tokens have the same referer when used in Node with a username and password.
  /* istanbul ignore next --@preserve */
  if (
    (typeof window === "undefined" ||
      (window && typeof window.document === "undefined")) &&
    !(fetchOptions.headers as any).referer
  ) {
    (fetchOptions.headers as any).referer = NODEJS_DEFAULT_REFERER_HEADER;
  }

  /* istanbul ignore next -- @preserve : blob responses are difficult to make cross platform we will just have to trust the isomorphic fetch will do its job */
  if (!requiresFormData(params) && !forceFormData) {
    (fetchOptions.headers as any)["Content-Type"] =
      "application/x-www-form-urlencoded";
  }

  const response: any = await globalThis.fetch(url, fetchOptions);

  // the request got back an error status code (4xx, 5xx)
  if (!response.ok) {
    // we need to determine if the server returned a JSON body with more details.
    // this is the format used by newer services such as the Places and Style service.
    try {
      const jsonError: any = await response.json();
      // The body can be parsed as JSON
      const { status, statusText } = response;
      const { message, details } = jsonError.error;
      const formattedMessage = `${message}. ${
        details ? details.join(" ") : ""
      }`.trim();

      throw new ArcGISRequestError(
        formattedMessage,
        `HTTP ${status} ${statusText}`,
        jsonError,
        url,
        options
      );
    } catch (e: any) {
      // if we already were about to format this as an ArcGISRequestError throw that error
      if (e.name === "ArcGISRequestError") {
        throw e;
      }

      // server responded w/ an actual error (404, 500, etc) but we could not parse it as JSON
      const { status, statusText } = response;
      throw new ArcGISRequestError(
        statusText,
        `HTTP ${status}`,
        response,
        url,
        options
      );
    }
  }

  return {
    response,
    url,
    originalUrl,
    options,
    originalAuthError
  };
}

/**
 * This is the internal implementation of `request` without the automatic retry behavior to prevent
 * infinite loops when a server continues to return invalid token errors.
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param requestOptions - Options for the request, including parameters relevant to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 * @internal
 */
export async function internalRequest(
  url: string,
  requestOptions: IRequestOptions
): Promise<any> {
  // -----------------------------
  // we want to only support json responses for request so we must override the f parameter to json if it is not json or geojson.
  // we should warn users f params will be ignored.
  if (
    requestOptions?.params?.f &&
    requestOptions.params.f !== "json" &&
    requestOptions.params.f !== "geojson"
  ) {
    console.warn(
      `request() only supports 'json' formats and responses. Provided value '${requestOptions.params.f}' will be defaulted to 'json'. Use 'rawRequest()' to support special 'f' parameter values.`
    );
    requestOptions.params = {
      ...requestOptions.params,
      ...{ f: "json" }
    };
  }
  // -----------------------------
  const {
    response,
    options,
    originalUrl,
    url: finalUrl,
    originalAuthError
  } = await executeRequest(url, requestOptions);

  const json = await response.json();

  // Check for an error in the JSON body of a successful response.
  // Most ArcGIS Server services will return a successful status code but include an error in the response body.
  checkForErrors(json, originalUrl, options, originalAuthError);

  // If this was a portal/self call, and we got authorizedNoCorsDomains back
  // register them
  if (json && /\/sharing\/rest\/(accounts|portals)\/self/i.test(finalUrl)) {
    // if we have a list of no-cors domains, register them
    if (Array.isArray(json.authorizedCrossOriginNoCorsDomains)) {
      registerNoCorsDomains(json.authorizedCrossOriginNoCorsDomains);
    }
  }

  if (originalAuthError) {
    /* If the request was made to an unfederated service that
    didn't require authentication, add the base url and a dummy token
    to the list of trusted servers to avoid another federation check
    in the event of a repeat request */
    const truncatedUrl: string = finalUrl
      .toLowerCase()
      .split(/\/rest(\/admin)?\/services\//)[0];

    (options.authentication as any).federatedServers[truncatedUrl] = {
      token: [],
      // default to 24 hours
      expires: new Date(Date.now() + 86400 * 1000)
    };
  }
  return json;
}

/**
 * Generic method for making HTTP requests to ArcGIS REST API endpoints and returning
 * the native [response](https://developer.mozilla.org/en-US/docs/Web/API/Response).
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param requestOptions - Options for the request, including parameters relevant to the endpoint.
 * @returns A Promise that will resolve with the native response.
 */
export async function rawRequest(
  url: string,
  requestOptions: IRequestOptions = { params: { f: "json" } }
): Promise<Response> {
  const { response } = await executeRequest(url, requestOptions);
  return response;
}

/**
 * Generic method for making HTTP requests to ArcGIS REST API endpoints.
 *
 * ```js
 * import { request } from '@esri/arcgis-rest-request';
 *
 * request('https://www.arcgis.com/sharing/rest')
 *   .then(response) // response.currentVersion === 5.2
 *
 * request('https://www.arcgis.com/sharing/rest', {
 *   httpMethod: "GET"
 * })
 *
 * request('https://www.arcgis.com/sharing/rest/search', {
 *   params: { q: 'parks' }
 * })
 *   .then(response) // response.total => 78379
 * ```
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param requestOptions - Options for the request, including parameters relevant to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export async function request(
  url: string,
  requestOptions: IRequestOptions = { params: { f: "json" } }
): Promise<any> {
  try {
    return await internalRequest(url, requestOptions);
  } catch (e: any) {
    if (
      e instanceof ArcGISAuthError &&
      requestOptions.authentication &&
      typeof requestOptions.authentication !== "string" &&
      requestOptions.authentication.canRefresh &&
      requestOptions.authentication.refreshCredentials
    ) {
      return e.retry(() => {
        return (requestOptions.authentication as any).refreshCredentials();
      }, 1);
    }

    throw e;
  }
}
