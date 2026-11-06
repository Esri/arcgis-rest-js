/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, cleanUrl } from "@esri/arcgis-rest-request";
import {
  IGetLayerOptions,
  IFeatureServiceDefinition,
  parseServiceUrl
} from "./helpers.js";

/**
 * Feature Service request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/feature-service.htm) for more information.
 *
 * ```js
 * import { getService } from '@esri/arcgis-rest-feature-service';
 * //
 * getService({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer"
 * })
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 *
 * If the `url` of a layer is passed (e.g. `.../FeatureServer/0`) the layer index is removed and the service is requested.
 *
 * @param options - Options for the request.
 * @returns A Promise that will resolve with the getService response.
 */
export function getService(
  options: IGetLayerOptions
): Promise<IFeatureServiceDefinition> {
  return request(parseServiceUrl(cleanUrl(options.url)), options);
}
