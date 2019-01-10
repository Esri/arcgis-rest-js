/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "../request";

// TypeScript 2.1 no longer allows you to extend built in types. See https://github.com/Microsoft/TypeScript/issues/12790#issuecomment-265981442
// and https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
//
// This code is from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types.
export class ArcGISRequestError {
  /**
   * The name of this error. Will always be `"ArcGISRequestError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
   */
  public name: string;

  /**
   * Formatted error message. See the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class for more details.
   */
  public message: string;

  /**
   * The errror message return from the request.
   */
  public originalMessage: string;

  /**
   * The error code returned from the request.
   */
  public code: string | number;

  /**
   * The original JSON response the caused the error.
   */
  public response: any;

  /**
   * The URL of the original request that caused the error
   */
  public url: string;

  /**
   * The options of the original request that caused the error
   */
  public options: IRequestOptions;

  /**
   * Create a new `ArcGISRequestError`  object.
   *
   * @param message - The error message from the API
   * @param code - The error code from the API
   * @param response - The original response from the API that caused the error
   * @param url - The original url of the request
   * @param options - The original options and parameters of the request
   */
  constructor(
    message?: string,
    code?: string | number,
    response?: any,
    url?: string,
    options?: IRequestOptions
  ) {
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
ArcGISRequestError.prototype = Object.create(Error.prototype);
ArcGISRequestError.prototype.constructor = ArcGISRequestError;
