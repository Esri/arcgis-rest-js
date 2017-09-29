/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Enum describing the different errors that might be thrown by a request.
 *
 * ```ts
 * import { request, ErrorTypes } from '@esri/arcgis-rest-request';
 *
 * request("...").catch((e) => {
 *   switch(e.name) {
 *     case ErrorType.ArcGISRequestError:
 *     // handle a general error from the API
 *     break;
 *
 *     case ErrorType.ArcGISAuthError:
 *     // handle an authentication error
 *     break;
 *
 *     default:
 *     // handle some other error (usually a network error)
 *   }
 * });
 * ```
 */
export enum ErrorTypes {
  ArcGISRequestError = "ArcGISRequestError",
  ArcGISAuthError = "ArcGISAuthError"
}
