import { IGetLayerOptions, ILayerDefinition } from "./helpers.js";
export interface IAllLayersAndTablesResponse {
    layers: ILayerDefinition[];
    tables: ILayerDefinition[];
}
/**
 *  * Fetches all the layers and tables associated with a given layer service.
 * Wrapper for https://developers.arcgis.com/rest/services-reference/all-layers-and-tables.htm
 *
 * ```js
 * import { getAllLayersAndTables } from '@esri/arcgis-rest-feature-service';
 * getAllLayersAndTables({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0"
 * })
 *   .then(response) // { layers: [...], tables: [...] }
 * ```
 *
 * @param options - Request options, including the url for the layer service
 * @returns A Promise that will resolve with the layers and tables for the given service
 */
export declare function getAllLayersAndTables(options: IGetLayerOptions): Promise<IAllLayersAndTablesResponse>;
