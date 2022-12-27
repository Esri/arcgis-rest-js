/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
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
export class ArcGISRequestError extends Error {
    /**
     * Create a new `ArcGISRequestError`  object.
     *
     * @param message - The error message from the API
     * @param code - The error code from the API
     * @param response - The original response from the API that caused the error
     * @param url - The original url of the request
     * @param options - The original options and parameters of the request
     */
    constructor(message, code, response, url, options) {
        // 'Error' breaks prototype chain here
        super(message);
        // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
        // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
        message = message || "UNKNOWN_ERROR";
        code = code || "UNKNOWN_ERROR_CODE";
        this.name = "ArcGISRequestError";
        this.message =
            code === "UNKNOWN_ERROR_CODE" ? message : `${code}: ${message}`;
        this.originalMessage = message;
        this.code = code;
        this.response = response;
        this.url = url;
        this.options = options;
    }
}
//# sourceMappingURL=ArcGISRequestError.js.map