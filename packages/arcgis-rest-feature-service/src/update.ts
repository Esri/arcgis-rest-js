/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IFeature } from "@esri/arcgis-rest-common-types";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import {
  IEditFeaturesParams,
  IEditFeatureResult,
  appendCustomParams
} from "./helpers";

/**
 * Update features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/update-features.htm) for more information.
 *
 * @param url - Feature service url.
 * @param updates - Array of JSON features to update.
 * @param params - Query parameters to be sent to the feature service via the request.
 */
export interface IUpdateFeaturesRequestOptions
  extends IEditFeaturesParams,
    IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Array of JSON features to update.
   */
  updates: IFeature[];
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
 * Update features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/update-features.htm) for more information.
 *
 * ```js
 * import { updateFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * updateFeatures({
 *   url,
 *   updates: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the updateFeatures response.
 */
export function updateFeatures(
  requestOptions: IUpdateFeaturesRequestOptions
): Promise<IUpdateFeaturesResult> {
  const url = `${requestOptions.url}/updateFeatures`;

  // edit operations are POST only
  const options: IUpdateFeaturesRequestOptions = {
    params: {},
    ...requestOptions
  };

  appendCustomParams(requestOptions, options);

  // mixin, don't overwrite
  options.params.features = requestOptions.updates;
  delete options.params.updates;

  return request(url, options);
}
