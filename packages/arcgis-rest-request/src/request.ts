/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeFormData } from "./utils/encode-form-data";
import { encodeQueryString } from "./utils/encode-query-string";
import { requiresFormData } from "./utils/process-params";
import { checkForErrors } from "./utils/check-for-errors";
import { ArcGISRequestError } from "./utils/ArcGISRequestError";
import { ArcGISAuthError } from "./utils/ArcGISAuthError";
import { IRequestOptions } from "./utils/IRequestOptions";
import { IParams } from "./utils/IParams";
import { warn } from "./utils/warn";

export const NODEJS_DEFAULT_REFERER_HEADER = `@esri/arcgis-rest-js`;

let DEFAULT_ARCGIS_REQUEST_OPTIONS: IRequestOptions = {
  httpMethod: "POST",
  params: {
    f: "json"
  }
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
        ...requestOptions.params
      },
      headers: {
        ...DEFAULT_ARCGIS_REQUEST_OPTIONS.headers,
        ...requestOptions.headers
      }
    }
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

  const { httpMethod, authentication, rawResponse } = options;

  const params: IParams = {
    ...{ f: "json" },
    ...options.params
  };

  let originalAuthError: ArcGISAuthError = null;

  const fetchOptions: RequestInit = {
    method: httpMethod,
    /* ensures behavior mimics XMLHttpRequest.
    needed to support sending IWA cookies */
    credentials: "same-origin"
  };

  return (authentication
    ? authentication.getToken(url, { fetch: options.fetch }).catch(err => {
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

      /* updateResources currently requires FormData even when the input parameters dont warrant it.
  https://developers.arcgis.com/rest/users-groups-and-items/update-resources.htm
      see https://github.com/Esri/arcgis-rest-js/pull/500 for more info. */
      const forceFormData = new RegExp("/items/.+/updateResources").test(url);

      if (fetchOptions.method === "POST") {
        fetchOptions.body = encodeFormData(params, forceFormData);
      }

      // Mixin headers from request options
      fetchOptions.headers = {
        ...options.headers
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
    .then(data => {
      if ((params.f === "json" || params.f === "geojson") && !rawResponse) {
        const response = checkForErrors(
          data,
          url,
          params,
          options,
          originalAuthError
        );
        if (originalAuthError) {
          /* if the request was made to an unfederated service that 
          didnt require authentication, add the base url and a dummy token
          to the list of trusted servers to avoid another federation check
          in the event of a repeat request */
          const truncatedUrl: string = url
            .toLowerCase()
            .split(/\/rest(\/admin)?\/services\//)[0];
          (options.authentication as any).trustedServers[truncatedUrl] = {
            token: [],
            // default to 24 hours
            expires: new Date(Date.now() + 86400 * 1000)
          };
          originalAuthError = null;
        }
        return response;
      } else {
        return data;
      }
    });
}
