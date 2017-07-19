import { ArcGISRequestError } from './ArcGISRequestError';
export function checkForErrors(data) {
    // this is an error message from billing.arcgis.com backend
    if (data.code >= 400) {
        var message = data.message, code = data.code;
        var apiErrorMessage = "" + code + (code ? ': ' : '') + message;
        throw new ArcGISRequestError(message, apiErrorMessage);
    }
    // error from the arcgis.com portal
    if (data.error) {
        var message = data.error.message;
        var errorCode = (data.error.messageCode || data.error.code) || '';
        var apiErrorMessage = "" + errorCode + (errorCode ? ': ' : '') + message;
        throw new ArcGISRequestError(message, apiErrorMessage);
    }
    // error from a status check
    if (data.status === 'failed') {
        var message = void 0;
        var code = '';
        try {
            message = JSON.parse(data.statusMessage).message;
            code = JSON.parse(data.statusMessage).code;
        }
        catch (e) {
            message = data.statusMessage;
        }
        var apiErrorMessage = "" + code + (code ? ': ' : '') + message;
        throw new ArcGISRequestError(message, apiErrorMessage);
    }
    return data;
}
//# sourceMappingURL=check-for-errors.js.map