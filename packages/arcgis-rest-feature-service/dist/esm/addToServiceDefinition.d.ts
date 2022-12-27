import { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { ILayer, ITable, ILayerDefinition } from "./helpers.js";
export interface IAddToServiceDefinitionOptions extends IUserRequestOptions {
    /**
     * Layers to add
     */
    layers?: ILayer[] | ILayerDefinition[];
    /**
     * Tables to add
     */
    tables?: ITable[];
}
export interface IAddToServiceDefinitionItemSummary {
    name: string;
    id: any;
}
export interface IAddToServiceDefinitionResult {
    layers?: IAddToServiceDefinitionItemSummary[];
    tables?: IAddToServiceDefinitionItemSummary[];
    success: boolean;
}
/**
 * Add layer(s) and/or table(s) to a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-to-definition-feature-service-.htm) for more information.
 *
 *  ```js
 * import { addToServiceDefinition } from '@esri/arcgis-rest-service-admin';
 * //
 * addToServiceDefinition(serviceurl, {
 *   authentication: ArcGISIdentityManager,
 *   layers: [],
 *   tables: []
 * });
 * ```
 *
 * @param url - URL of feature service
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with service layer and/or table details once the definition
 * has been updated
 */
export declare function addToServiceDefinition(url: string, requestOptions: IAddToServiceDefinitionOptions): Promise<IAddToServiceDefinitionResult>;
