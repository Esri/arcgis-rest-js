import { IGetLayerOptions, IFeatureServiceDefinition } from "./helpers.js";
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
 * @param options - Options for the request.
 * @returns A Promise that will resolve with the getService response.
 */
export declare function getService(options: IGetLayerOptions): Promise<IFeatureServiceDefinition>;
