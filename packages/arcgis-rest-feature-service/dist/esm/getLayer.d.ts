import { IGetLayerOptions, ILayerDefinition } from "./helpers.js";
/**
 * Layer (Feature Service) request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/layer-feature-service-.htm) for more information.
 *
 * ```js
 * import { getLayer } from '@esri/arcgis-rest-feature-service';
 * //
 * getLayer({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0"
 * })
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 *
 * @param options - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export declare function getLayer(options: IGetLayerOptions): Promise<ILayerDefinition>;
