import { ArcGISRequestError } from "./ArcGISRequestError";

/**
 * Checks JSON responses from the ArcGIS REST API for errors. If there are no errors this will return the `data` it is passed in. If there is an error it will throw. With a [`ArcGISRequestError`](/api/arcgis-core/ArcGISRequestError/).
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
    const message = data.error.message;
    const code =
      data.error.messageCode || data.error.code || "UNKNOWN_ERROR_CODE";
    throw new ArcGISRequestError(message, code, data);
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
