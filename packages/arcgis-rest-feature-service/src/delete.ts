/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import {
  ISharedEditOptions,
  IEditFeatureResult,
  ISharedQueryOptions
} from "./helpers.js";

/**
 * Delete features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
 *
 */
export interface IDeleteFeaturesOptions
  extends ISharedEditOptions,
    ISharedQueryOptions {
  /**
   * Array of objectIds to delete.
   */
  objectIds: number[];
}

/**
 * Delete features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
 *
 * ```js
 * import { deleteFeatures } from '@esri/arcgis-rest-feature-service';
 * //
 * deleteFeatures({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   objectIds: [1,2,3]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the deleteFeatures response.
 */
export function deleteFeatures(
  requestOptions: IDeleteFeaturesOptions
): Promise<{ deleteResults: IEditFeatureResult[] }> {
  const url = `${cleanUrl(requestOptions.url)}/deleteFeatures`;

  // edit operations POST only
  const options = appendCustomParams<IDeleteFeaturesOptions>(
    requestOptions,
    [
      "where",
      "objectIds",
      "gdbVersion",
      "returnEditMoment",
      "rollbackOnFailure"
    ],
    { params: { ...requestOptions.params } }
  );

  return request(url, options);
}
