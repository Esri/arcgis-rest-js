// TypeScript 2.1 no longer allows you to extend built in types. See https://github.com/Microsoft/TypeScript/issues/12790#issuecomment-265981442
// and https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
//
// This code is from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types.
export class ArcGISRequestError {
  name: string;
  message: string;
  apiErrorMessage: string;

  constructor (message = 'UNKNOWN_ERROR', apiErrorMessage = '') {
    this.name = 'ArcGISEndpointError';
    this.message = message;
    this.apiErrorMessage = apiErrorMessage;
  }
};
ArcGISRequestError.prototype = Object.create(Error.prototype);
ArcGISRequestError.prototype.constructor = ArcGISRequestError;
