/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  IParams,
  IAuthenticationManager
} from "../request";
import { ArcGISRequestError } from "./ArcGISRequestError";

export type IRetryAuthError = (
  url: string,
  params: IParams,
  options: IRequestOptions
) => Promise<IAuthenticationManager>;

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
    code: string | number = "AUTHENTICATION_ERROR_CODE",
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

  retry(getSession: IRetryAuthError, retryLimit = 3) {
    let tries = 0;

    const retryRequest = (resolve: any, reject: any) => {
      getSession(this.url, this.params, this.options)
        .then(session => {
          const newOptions = {
            ...this.options,
            ...{ authentication: session }
          };

          tries = tries + 1;
          return request(this.url, this.params, newOptions);
        })
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          if (e.name === "ArcGISAuthError" && tries < retryLimit) {
            retryRequest(resolve, reject);
          } else if (e.name === "ArcGISAuthError" && tries >= retryLimit) {
            reject(this);
          } else {
            reject(e);
          }
        });
    };

    return new Promise((resolve, reject) => {
      retryRequest(resolve, reject);
    });
  }
}
