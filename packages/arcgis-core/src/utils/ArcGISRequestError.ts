// TypeScript 2.1 no longer allows you to extend built in types. See https://github.com/Microsoft/TypeScript/issues/12790#issuecomment-265981442
// and https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
//
// This code is from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types.
export class ArcGISRequestError {
  /**
   * The name of this error. Will always be `"ArcGISEndpointError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
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
  code: string;

  /**
   * The original JSON response the caused the error.
   */
  originalResponse: any;

  /**
   * Create a new `ArcGISEndpointError`  object.
   *
   * @param message - The error message from the API
   * @param code - The error code from the API
   * @param originalResponse - The original response from the API that caused the error
   */
  constructor(
    message = "UNKNOWN_ERROR",
    code = "UNKNOWN_ERROR_CODE",
    originalResponse: any = {}
  ) {
    this.name = "ArcGISEndpointError";
    this.message =
      code === "UNKNOWN_ERROR_CODE" ? message : `${code}: ${message}`;
    this.originalMessage = message;
    this.code = code;
    this.originalResponse = originalResponse;
  }
}
ArcGISRequestError.prototype = Object.create(Error.prototype);
ArcGISRequestError.prototype.constructor = ArcGISRequestError;
