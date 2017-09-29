/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISRequestError } from "./ArcGISRequestError";
import { ArcGISAuthError } from "./ArcGISAuthError";
import { IRequestOptions, IParams } from "../request";
/**
 * Checks a JSON response from the ArcGIS REST API for errors. If there are no errors this will return the `data` it is passed in. If there is an error it will throw. With a [`ArcGISRequestError`](/api/arcgis-core/ArcGISRequestError/) or [`ArcGISAuthError`](/api/arcgis-core/ArcGISAuthError/).
 *
 * @param data The response JSON to check for errors.
 * @param url The url of the original request
 * @param params The parameters of the original request
 * @param options The options of the original request
 * @returns The data that was passed in the `data` parameter
 */
export function checkForErrors(
  response: any,
  url?: string,
  params?: IParams,
  options?: IRequestOptions
): any {
  // this is an error message from billing.arcgis.com backend
  if (response.code >= 400) {
    const { message, code } = response;
    throw new ArcGISRequestError(message, code, response, url, params, options);
  }

  // error from ArcGIS Online or an ArcGIS Portal or server instance.
  if (response.error) {
    const { message, code, messageCode } = response.error;
    const errorCode = messageCode || code || "UNKNOWN_ERROR_CODE";

    if (code === 498 || code === 499 || messageCode === "GWM_0003") {
      throw new ArcGISAuthError(
        message,
        errorCode,
        response,
        url,
        params,
        options
      );
    }

    throw new ArcGISRequestError(
      message,
      errorCode,
      response,
      url,
      params,
      options
    );
  }

  // error from a status check
  if (response.status === "failed") {
    let message: string;
    let code: string = "UNKNOWN_ERROR_CODE";

    try {
      message = JSON.parse(response.statusMessage).message;
      code = JSON.parse(response.statusMessage).code;
    } catch (e) {
      message = response.statusMessage;
    }

    throw new ArcGISRequestError(message, code, response, url, params, options);
  }

  return response;
}
