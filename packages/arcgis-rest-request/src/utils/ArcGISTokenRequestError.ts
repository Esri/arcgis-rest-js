/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";

/**
 * `TOKEN_REFRESH_FAILED` - When a request for an access token fails.
 * `GENERATE_TOKEN_FOR_SERVER_FAILED` - When a request for a token for a specific federated server fails.
 * `REFRESH_TOKEN_EXCHANGE_FAILED` - When a request for a new refresh token fails.
 * `UNKNOWN_ERROR_CODE` - The error is unknown.
 */
export enum ArcGISTokenRequestErrorCodes {
  TOKEN_REFRESH_FAILED = "TOKEN_REFRESH_FAILED",
  GENERATE_TOKEN_FOR_SERVER_FAILED = "GENERATE_TOKEN_FOR_SERVER_FAILED",
  REFRESH_TOKEN_EXCHANGE_FAILED = "REFRESH_TOKEN_EXCHANGE_FAILED",
  UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR_CODE"
}

// TypeScript 2.1 no longer allows you to extend built in types. See https://github.com/Microsoft/TypeScript/issues/12790#issuecomment-265981442
// and https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
//
// This code is from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types.
export class ArcGISTokenRequestError extends Error {
  /**
   * The name of this error. Will always be `"ArcGISTokenRequestError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
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
   * The error code for the request.
   */
  public code: ArcGISTokenRequestErrorCodes;

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
   * Create a new `ArcGISTokenRequestError`  object.
   *
   * @param message - The error message from the API
   * @param code - The error code from the API
   * @param response - The original response from the API that caused the error
   * @param url - The original url of the request
   * @param options - The original options and parameters of the request
   */
  constructor(
    message = "UNKNOWN_ERROR",
    code = ArcGISTokenRequestErrorCodes.UNKNOWN_ERROR_CODE,
    response?: any,
    url?: string,
    options?: IRequestOptions
  ) {
    // 'Error' breaks prototype chain here
    super(message);

    // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    // we don't need to check for Object.setPrototypeOf as in the answers becasue we are ES2017 now
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);

    this.name = "ArcGISTokenRequestError";
    this.message = `${code}: ${message}`;
    this.originalMessage = message;
    this.code = code;
    this.response = response;
    this.url = url;
    this.options = options;
  }
}
