/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  cleanUrl,
  ILayerDefinition
} from "@esri/arcgis-rest-request";

/**
 * ```js
 * import { getLayer } from '@esri/arcgis-rest-feature-service';
 * //
 * getLayer("https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0")
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 * Layer (Feature Service) request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/layer-feature-service-.htm) for more information.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export function getLayer(
  url: string,
  requestOptions?: IRequestOptions
): Promise<ILayerDefinition> {
  return request(cleanUrl(url), requestOptions);
}
