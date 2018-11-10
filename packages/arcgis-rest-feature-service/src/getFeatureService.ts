/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { ILayerDefinition } from "@esri/arcgis-rest-common-types";

/**
 * Layer (Feature Service) request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/layer-feature-service-.htm) for more information.
 *
 * ```js
 * import { getFeatureService } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * getFeatureService(url)
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export function getFeatureService(
  url: string,
  requestOptions: IRequestOptions
): Promise<ILayerDefinition> {
  return request(url, requestOptions);
}
