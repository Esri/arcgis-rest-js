import { ArcGISRequestError } from "./ArcGISRequestError";
import { ArcGISAuthError } from "./ArcGISAuthError";

/**
 * Checks a JSON response from the ArcGIS REST API for errors. If there are no errors this will return the `data` it is passed in. If there is an error it will throw. With a [`ArcGISRequestError`](/api/arcgis-core/ArcGISRequestError/) or [`ArcGISAuthError`](/api/arcgis-core/ArcGISAuthError/).
 *
 * @param data The response JSON to check for errors.
 * @returns The data that was passed in the `data` parameter
 */
export function checkForErrors(data: any): any {
  // this is an error message from billing.arcgis.com backend
  if (data.code >= 400) {
    const { message, code } = data;
    throw new ArcGISRequestError(message, code, data);
  }

  // error from ArcGIS Online or an ArcGIS Portal or server instance.
  if (data.error) {
    const { message, code, messageCode } = data.error;
    const errorCode = messageCode || code || "UNKNOWN_ERROR_CODE";

    if (code === 498 || code === 499 || messageCode === "GWM_0003") {
      throw new ArcGISAuthError(message, errorCode, data);
    }

    throw new ArcGISRequestError(message, errorCode, data);
  }

  // error from a status check
  if (data.status === "failed") {
    let message: string;
    let code: string = "UNKNOWN_ERROR_CODE";

    try {
      message = JSON.parse(data.statusMessage).message;
      code = JSON.parse(data.statusMessage).code;
    } catch (e) {
      message = data.statusMessage;
    }

    throw new ArcGISRequestError(message, code, data);
  }

  return data;
}
