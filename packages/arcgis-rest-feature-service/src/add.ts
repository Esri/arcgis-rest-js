/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  cleanUrl,
  appendCustomParams,
  IFeature
} from "@esri/arcgis-rest-request";

import { IEditFeaturesParams, IEditFeatureResult } from "./helpers";

/**
 * Add features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-features.htm) for more information.
 *
 * @param url - Feature service url.
 * @param features - Array of JSON features to add.
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
  features: IFeature[];
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
 * ```js
 * import { addFeatures } from '@esri/arcgis-rest-feature-service';
 * //
 * addFeatures({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   features: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * })
 *   .then(response)
 * ```
 * Add features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-features.htm) for more information.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export function addFeatures(
  requestOptions: IAddFeaturesRequestOptions
): Promise<IAddFeaturesResult> {
  const url = `${cleanUrl(requestOptions.url)}/addFeatures`;

  // edit operations are POST only
  const options = appendCustomParams<IAddFeaturesRequestOptions>(
    requestOptions,
    ["features", "gdbVersion", "returnEditMoment", "rollbackOnFailure"],
    { params: { ...requestOptions.params } }
  );

  return request(url, options);
}
