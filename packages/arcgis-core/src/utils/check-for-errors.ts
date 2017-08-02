import { ArcGISRequestError } from "./ArcGISRequestError";

export function checkForErrors(data: any): any {
  // this is an error message from billing.arcgis.com backend
  if (data.code >= 400) {
    const { message, code } = data;
    const apiErrorMessage = `${code}${code ? ": " : ""}${message}`;
    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  // error from the arcgis.com portal
  if (data.error) {
    const message = data.error.message;
    const errorCode = data.error.messageCode || data.error.code || "";
    const apiErrorMessage = `${errorCode}${errorCode ? ": " : ""}${message}`;
    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  // error from a status check
  if (data.status === "failed") {
    let message: string;
    let code: any = "";

    try {
      message = JSON.parse(data.statusMessage).message;
      code = JSON.parse(data.statusMessage).code;
    } catch (e) {
      message = data.statusMessage;
    }

    const apiErrorMessage = `${code}${code ? ": " : ""}${message}`;

    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  return data;
}
