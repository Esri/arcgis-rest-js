/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  appendCustomParams,
  cleanUrl
} from "@esri/arcgis-rest-request";
import {
  IEditFeaturesParams,
  IEditFeatureResult,
  ISharedQueryParams
} from "./helpers";

/**
 * Delete features parameters.
 */
export interface IDeleteFeaturesParams
  extends IEditFeaturesParams,
    ISharedQueryParams {}

/**
 * Delete features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
 *
 * @param url - Feature service url.
 * @param objectIds - Array of objectIds to delete.
 * @param params - Query parameters to be sent to the feature service via the request.
 */
export interface IDeleteFeaturesRequestOptions
  extends IDeleteFeaturesParams,
    IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Array of objectIds to delete.
   */
  objectIds: number[];
}

/**
 * Delete features results.
 */
export interface IDeleteFeaturesResult {
  /**
   * Array of JSON response Object(s) for each feature deleted.
   */
  deleteResults?: IEditFeatureResult[];
}

/**
 * ```js
 * import { deleteFeatures } from '@esri/arcgis-rest-feature-service';
 * //
 * deleteFeatures({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   objectIds: [1,2,3]
 * });
 * ```
 * Delete features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
 *
 * @param deleteFeaturesRequestOptions - Options for the request.
 * @returns A Promise that will resolve with the deleteFeatures response.
 */
export function deleteFeatures(
  requestOptions: IDeleteFeaturesRequestOptions
): Promise<IDeleteFeaturesResult> {
  const url = `${cleanUrl(requestOptions.url)}/deleteFeatures`;

  // edit operations POST only
  const options: IDeleteFeaturesRequestOptions = {
    params: {},
    ...requestOptions
  };

  appendCustomParams(requestOptions, options);

  return request(url, options);
}
