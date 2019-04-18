/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import { IFeature } from "@esri/arcgis-rest-types";

import {
  ILayerRequestOptions,
  IEditFeaturesParams,
  IEditFeatureResult
} from "./helpers";

/**
 * Update features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/update-features.htm) for more information.
 *
 * @param url - Feature service url.
 * @param features - Array of JSON features to update.
 * @param params - Query parameters to be sent to the feature service via the request.
 */
export interface IUpdateFeaturesRequestOptions
  extends IEditFeaturesParams,
    ILayerRequestOptions {
  /**
   * Array of JSON features to update.
   */
  features: IFeature[];
}

/**
 * Update features results.
 */
export interface IUpdateFeaturesResult {
  /**
   * Array of JSON response Object(s) for each feature updated.
   */
  updateResults?: IEditFeatureResult[];
}

/**
 *
 * ```js
 * import { updateFeatures } from '@esri/arcgis-rest-feature-layer';
 * //
 * updateFeatures({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   features: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * });
 * ```
 * Update features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/update-features.htm) for more information.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the updateFeatures response.
 */
export function updateFeatures(
  requestOptions: IUpdateFeaturesRequestOptions
): Promise<IUpdateFeaturesResult> {
  const url = `${cleanUrl(requestOptions.url)}/updateFeatures`;

  // edit operations are POST only
  const options = appendCustomParams<IUpdateFeaturesRequestOptions>(
    requestOptions,
    ["features", "gdbVersion", "returnEditMoment", "rollbackOnFailure"],
    { params: { ...requestOptions.params } }
  );

  return request(url, options);
}
