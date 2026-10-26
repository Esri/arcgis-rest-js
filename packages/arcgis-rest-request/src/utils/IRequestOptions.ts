import { HTTPMethods } from "./HTTPMethods.js";
import { IParams } from "./IParams.js";
import { IAuthenticationManager } from "./IAuthenticationManager.js";

// NOTE: the `requestOptionsKeys` array in ./append-custom-params.ts
// must be kept in sync with this interface
/**
 * Legacy request option properties kept for backwards compatibility.
 *
 * @deprecated This interface contains deprecated properties from the REST JS v4 @linkcode{IRequestOptions}, use @linkcode{IRequestOptions} instead.
 */
export interface ILegacyRequestOptions {
  /**
   * The HTTP method to send the request with.
   * @deprecated Use `fetchOptions.httpMethod` in @linkcode{IRequestOptions} instead.
   */
  httpMethod?: HTTPMethods;
  /**
   * Return the raw [response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
   * @deprecated since v4.0.0.
   */
  rawResponse?: boolean;
  /**
   * Prevents the token from being passed in a URL query parameter that is saved in browser history.
   * @deprecated Use the `useAuthorizationHeader` or `useXEsriAuthorizationHeader` flags in @linkcode{IRequestFlags} to send the token in only the request headers.
   */
  hideToken?: boolean;
  /**
   * A string indicating whether credentials (cookies) will be sent with the request. Used internally for authentication workflows.
   * @deprecated Use `fetchOptions.credentials` in @linkcode{IRequestOptions} instead.
   */
  credentials?: RequestCredentials;
  /**
   * If the length of a GET request's URL exceeds `maxUrlLength` the request will use POST instead.
   * @deprecated This top-level option is legacy and will be removed in a future release.
   */
  maxUrlLength?: number;
  /**
   * Additional [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) to pass into the request.
   * @deprecated Use `fetchOptions.headers` in @linkcode{IRequestOptions} instead.
   */
  headers?: {
    [key: string]: any;
  };
  /**
   * An [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) object instance; allows you to abort a request and via an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
   * @deprecated Use `fetchOptions.signal` in @linkcode{IRequestOptions} instead.
   */
  signal?: AbortSignal;
  /**
   * Suppress any ArcGIS REST JS related warnings for this request.
   * @deprecated Use `requestFlags.suppressWarnings` in @linkcode{IRequestOptions} instead.
   */
  suppressWarnings?: boolean;
}

/**
 * Internal flags that control ArcGIS REST JS request behavior.
 *
 */
export interface IRequestFlags {
  /**
   * Use the `Authorization` header to send the token in request headers.
   * Using this flag will move the token out of the URL query parameters in GET requests and out of the request body in POST requests.
   */
  useAuthorizationHeader?: boolean;
  /**
   * Use the `X-Esri-Authorization` header to send the token in request headers.
   * Using this flag will move the token out of the URL query parameters in GET requests and out of the request body in POST requests.
   */
  useXEsriAuthorizationHeader?: boolean;
  /**
   * Suppresses ArcGIS REST JS request warnings for this call, including deprecation
   * and format-related warnings emitted during request processing.
   */
  suppressWarnings?: boolean;
  /**
   * Reserved for response header injection behavior.
   *
   * Note: this flag is currently defined for API compatibility/documentation, but is
   * not actively applied in the current request pipeline.
   */
  injectRequestHeaders?: boolean;
  /**
   * Disables automatic GET -> POST conversion based solely on URL length (2000+ chars).
   */
  ignoreMaxUrlLength?: boolean;
}

/**
 * Options for the `request()` method.
 */
export interface IRequestOptions extends ILegacyRequestOptions {
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
  /**
   * ArcGIS REST JS runtime flags.
   */
  requestFlags?: IRequestFlags;
  /**
   * anything you can pass to the options for fetch
   * https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
   * REST JS may override or ignore these as it sees fit. REST JS
   * currently modifies the headers and credentials options.
   **/
  fetchOptions?: RequestInit;
}
