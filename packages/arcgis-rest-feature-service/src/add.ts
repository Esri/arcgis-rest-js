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
 * Add features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-features.htm) for more information.
 *
 * @param url - Feature service url.
 * @param adds - Array of JSON features to add.
 * @param params - Query parameters to be sent to the feature service via the request.
 */
export interface IAddFeaturesRequestOptions
  extends IEditFeaturesParams,
    IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Array of JSON features to add.
   */
  adds: IFeature[];
}

/**
 * Add features results.
 */
export interface IAddFeaturesResult {
  /**
   * Array of JSON response Object(s) for each feature added.
   */
  addResults?: IEditFeatureResult[];
}

/**
 * Add features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-features.htm) for more information.
 *
 * ```js
 * import { addFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * addFeatures({
 *   url,
 *   adds: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export function addFeatures(
  requestOptions: IAddFeaturesRequestOptions
): Promise<IAddFeaturesResult> {
  const url = `${requestOptions.url}/addFeatures`;

  // edit operations are POST only
  const options: IAddFeaturesRequestOptions = {
    params: {},
    ...requestOptions
  };

  appendCustomParams(requestOptions, options);

  // mixin, don't overwrite
  options.params.features = requestOptions.adds;
  delete options.params.adds;

  return request(url, options);
}
