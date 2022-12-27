import { IRequestOptions } from "./IRequestOptions.js";
/**
 * This represents a generic error from an ArcGIS endpoint. There will be details about the error in the {@linkcode ArcGISRequestError.message},  {@linkcode ArcGISRequestError.originalMessage} properties on the error. You
 * can also access the original server response at  {@linkcode ArcGISRequestError.response} which may have additional details.
 *
 * ```js
 * request(someUrl, someOptions).catch(e => {
 *   if(e.name === "ArcGISRequestError") {
 *     console.log("Something went wrong with the request:", e);
 *     console.log("Full server response", e.response);
 *   }
 * })
 * ```
 */
export declare class ArcGISRequestError extends Error {
    /**
     * The name of this error. Will always be `"ArcGISRequestError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
     */
    name: string;
    /**
     * Formatted error message. See the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class for more details.
     */
    message: string;
    /**
     * The errror message return from the request.
     */
    originalMessage: string;
    /**
     * The error code returned from the request.
     */
    code: string | number;
    /**
     * The original JSON response the caused the error.
     */
    response: any;
    /**
     * The URL of the original request that caused the error
     */
    url: string;
    /**
     * The options of the original request that caused the error
     */
    options: IRequestOptions;
    /**
     * Create a new `ArcGISRequestError`  object.
     *
     * @param message - The error message from the API
     * @param code - The error code from the API
     * @param response - The original response from the API that caused the error
     * @param url - The original url of the request
     * @param options - The original options and parameters of the request
     */
    constructor(message?: string, code?: string | number, response?: any, url?: string, options?: IRequestOptions);
}
