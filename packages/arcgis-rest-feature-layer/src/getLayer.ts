/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, cleanUrl } from "@esri/arcgis-rest-request";
import { ILayerRequestOptions } from "./helpers";
import { ILayerDefinition } from "@esri/arcgis-rest-types";

/**
 * ```js
 * import { getLayer } from '@esri/arcgis-rest-feature-layer';
 * //
 * getLayer({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0"
 * })
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 * Layer (Feature Service) request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/layer-feature-service-.htm) for more information.
 *
 * @param options - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export function getLayer(
  options: ILayerRequestOptions
): Promise<ILayerDefinition> {
  return request(cleanUrl(options.url), options);
}
