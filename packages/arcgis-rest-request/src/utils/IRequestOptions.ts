import { HTTPMethods } from "./HTTPMethods.js";
import { IParams } from "./IParams.js";
import { IAuthenticationManager } from "./IAuthenticationManager.js";

// NOTE: the `requestOptionsKeys` array in ./append-custom-params.ts
// must be kept in sync with this interface
/**
 * Legacy request option properties kept for backwards compatibility.
 *
 * @deprecated Use the new `requestFlags` object on `IRequestOptions` where applicable.
 */
export interface _ILegacyRequestOptions {
  /**
   * The HTTP method to send the request with.
   * @deprecated This top-level option is legacy and will be removed in a future release.
   */
  httpMethod?: HTTPMethods;
  /**
   * Return the raw [response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
   * @deprecated since v4.0.0.
   */
  rawResponse?: boolean;
  /**
   * Prevents the token from being passed in a URL Query param that is saved in browser history.
   * Instead, the token will be passed in POST request body or through X-Esri-Authorization header.
   * NOTE: This will force POST requests in browsers since auth header is not yet supported by preflight OPTIONS check with CORS.
   * @deprecated Use `requestFlags.hideToken`.
   */
  hideToken?: boolean;
  /**
   * A string indicating whether credentials (cookies) will be sent with the request. Used internally for authentication workflows.
   * @deprecated This top-level option is legacy and will be removed in a future release.
   */
  credentials?: RequestCredentials;
  /**
   * If the length of a GET request's URL exceeds `maxUrlLength` the request will use POST instead.
   * @deprecated This top-level option is legacy and will be removed in a future release.
   */
  maxUrlLength?: number;
  /**
   * Additional [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) to pass into the request.
   * @deprecated This top-level option is legacy and will be removed in a future release.
   */
  headers?: {
    [key: string]: any;
  };
  /**
   * An [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) object instance; allows you to abort a request and via an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
   * @deprecated This top-level option is legacy and will be removed in a future release.
   */
  signal?: AbortSignal;
  /**
   * Suppress any ArcGIS REST JS related warnings for this request.
   * @deprecated Use `requestFlags.suppressWarnings`.
   */
  suppressWarnings?: boolean;
  /**
   * Override the default function for making the request. This is mainly useful for testing purposes (i.e. so you can pass in a spy).
   * @deprecated since v4.0.0
   * @param requestOptions
   * @returns
   */
  request?: (
    url: string,
    requestOptions: InternalRequestOptions
  ) => Promise<any>;
}

/**
 * Options for the `request()` method.
 */
export interface IRequestOptions extends _ILegacyRequestOptions {
  /**
   * Additional parameters to pass in the request.
   */
  params?: Record<string, any> | IParams; // any additional params to append to the request
  /**
   * The instance of {@linkcode @esri/arcgis-rest-request!ArcGISIdentityManager}, {@linkcode @esri/arcgis-rest-request!ApplicationCredentialsManager} or {@linkcode @esri/arcgis-rest-request!ApiKeyManager} to use to authenticate this request. A token may also be passed directly as a string however using the built in authentication managers is encouraged.
   */
  authentication?: IAuthenticationManager | string;
  /**
   * Base url for the portal you want to make the request to. Defaults to authentication.portal if authentication
   * exists, otherwise to 'https://www.arcgis.com/sharing/rest'.
   */
  portal?: string;
  requestFlags?: {
    // additional options for our internal request method
    hideToken?: boolean; // put the token param in the header for GET requests
    suppressWarnings?: boolean; // silence all internal console warnings from REST JS
    injectRequestHeaders?: boolean; // add a `arcgisRestRequestHeaders` property that returns the request headers to resolve https://github.com/Esri/arcgis-rest-js/issues/1181
  };
  /**
   * anything you can pass to the options for fetch
   * https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
   * REST JS may override or ignore these as it sees fit. REST JS
   * currently modifies the headers and credentials options.
   **/
  fetchOptions?: RequestInit;
}

/**
 * Options for the function that will be making the actual request.
 */
export type InternalRequestOptions = Omit<IRequestOptions, "request">;
