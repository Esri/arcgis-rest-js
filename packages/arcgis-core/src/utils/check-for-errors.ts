import { ArcGISRequestError } from './ArcGISRequestError';

export function checkForErrors (data: any): any {
  // this is an error message from billing.arcgis.com backend
  if (data.code >= 400) {
    let { message, code } = data;
    let apiErrorMessage = `${code}${code ? ': ' : ''}${message}`;
    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  // error from the arcgis.com portal
  if (data.error) {
    let message = data.error.message;
    let errorCode = (data.error.messageCode || data.error.code) || '';
    let apiErrorMessage = `${errorCode}${errorCode ? ': ' : ''}${message}`;
    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  // error from a status check
  if (data.status === 'failed') {
    let message: string;
    let code: any = '';

    try {
      message = JSON.parse(data.statusMessage).message;
      code = JSON.parse(data.statusMessage).code;
    } catch (e) {
      message = data.statusMessage;
    }

    let apiErrorMessage = `${code}${code ? ': ' : ''}${message}`;

    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  return data;
}
