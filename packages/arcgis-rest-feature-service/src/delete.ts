/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import {
  IEditFeaturesParams,
  IEditFeatureResult,
  ISharedQueryParams,
  appendCustomParams
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
 * @param deletes - Array of objectIds to delete.
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
  deletes: number[];
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
 * Delete features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
 *
 * ```js
 * import { deleteFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * deleteFeatures({
 *   url,
 *   deletes: [1,2,3]
 * });
 * ```
 *
 * @param deleteFeaturesRequestOptions - Options for the request.
 * @returns A Promise that will resolve with the deleteFeatures response.
 */
export function deleteFeatures(
  requestOptions: IDeleteFeaturesRequestOptions
): Promise<IDeleteFeaturesResult> {
  const url = `${requestOptions.url}/deleteFeatures`;

  // edit operations POST only
  const options: IDeleteFeaturesRequestOptions = {
    params: {},
    ...requestOptions
  };

  appendCustomParams(requestOptions, options);

  // mixin, don't overwrite
  options.params.objectIds = requestOptions.deletes;
  delete options.params.deletes;

  return request(url, options);
}
