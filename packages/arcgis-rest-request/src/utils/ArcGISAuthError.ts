import { ArcGISRequestError } from "./ArcGISRequestError";
import { IRetryAuthError } from "./retryAuthError";
import { IRequestOptions } from "./IRequestOptions";
import { request } from "../request";

export class ArcGISAuthError extends ArcGISRequestError {
  /**
   * Create a new `ArcGISAuthError`  object.
   *
   * @param message - The error message from the API
   * @param code - The error code from the API
   * @param response - The original response from the API that caused the error
   * @param url - The original url of the request
   * @param options - The original options of the request
   */
  constructor(
    message = "AUTHENTICATION_ERROR",
    code: string | number = "AUTHENTICATION_ERROR_CODE",
    response?: any,
    url?: string,
    options?: IRequestOptions
  ) {
    super(message, code, response, url, options);
    this.name = "ArcGISAuthError";
    this.message =
      code === "AUTHENTICATION_ERROR_CODE" ? message : `${code}: ${message}`;
  }

  public retry(getSession: IRetryAuthError, retryLimit = 3) {
    let tries = 0;

    const retryRequest = (resolve: any, reject: any) => {
      getSession(this.url, this.options)
        .then(session => {
          const newOptions = {
            ...this.options,
            ...{ authentication: session }
          };

          tries = tries + 1;
          return request(this.url, newOptions);
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
