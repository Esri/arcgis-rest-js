import { ArcGISRequestError } from "./utils/ArcGISRequestError.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";
import { IParams } from "./utils/IParams.js";
import { IRetryAuthError } from "./utils/retryAuthError.js";
export declare const NODEJS_DEFAULT_REFERER_HEADER = "@esri/arcgis-rest-js";
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
 * @param options The default options to pass with every request. Existing default will be overwritten.
 * @param hideWarnings Silence warnings about setting default `authentication` in shared environments.
 */
export declare function setDefaultRequestOptions(options: IRequestOptions, hideWarnings?: boolean): void;
export declare function getDefaultRequestOptions(): any;
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
export declare class ArcGISAuthError extends ArcGISRequestError {
    /**
     * Create a new `ArcGISAuthError`  object.
     *
     * @param message - The error message from the API
     * @param code - The error code from the API
     * @param response - The original response from the API that caused the error
     * @param url - The original url of the request
     * @param options - The original options of the request
     */
    constructor(message?: string, code?: string | number, response?: any, url?: string, options?: IRequestOptions);
    retry(getSession: IRetryAuthError, retryLimit?: number): Promise<unknown>;
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
export declare function checkForErrors(response: any, url?: string, params?: IParams, options?: IRequestOptions, originalAuthError?: ArcGISAuthError): any;
/**
 * This is the internal implementation of `request` without the automatic retry behavior to prevent
 * infinite loops when a server continues to return invalid token errors.
 *
 * @param url - The URL of the ArcGIS REST API endpoint.
 * @param requestOptions - Options for the request, including parameters relevant to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 * @internal
 */
export declare function internalRequest(url: string, requestOptions: IRequestOptions): Promise<any>;
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
export declare function request(url: string, requestOptions?: IRequestOptions): Promise<any>;
