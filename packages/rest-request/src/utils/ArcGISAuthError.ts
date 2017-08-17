import { IRequestOptions, IParams } from "../request";
import { ArcGISRequestError } from "./ArcGISRequestError";

export class ArcGISAuthError extends ArcGISRequestError {
  /**
   * Create a new `ArcGISAuthError`  object.
   *
   * @param message - The error message from the API
   * @param code - The error code from the API
   * @param response - The original response from the API that caused the error
   * @param url - The original url of the request
   * @param params - The original params of the request
   * @param options - The original options of the request
   */
  constructor(
    message = "AUTHENTICATION_ERROR",
    code = "AUTHENTICATION_ERROR_CODE",
    response?: any,
    url?: string,
    params?: IParams,
    options?: IRequestOptions
  ) {
    super(message, code, response, url, params, options);
    this.name = "ArcGISAuthError";
    this.message =
      code === "AUTHENTICATION_ERROR_CODE" ? message : `${code}: ${message}`;
  }
}
