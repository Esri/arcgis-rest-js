import { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { IFeatureServiceDefinition } from "./helpers.js";
export interface IUpdateServiceDefinitionOptions extends IUserRequestOptions {
    updateDefinition?: Partial<IFeatureServiceDefinition>;
}
export interface IUpdateServiceDefinitionResult {
    success: boolean;
}
/**
 * Update a definition property in a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/online/update-definition-feature-service-.htm) for more information.
 *
 * ```js
 * import { updateServiceDefinition } from '@esri/arcgis-rest-service-admin';
 * //
 * updateServiceDefinition(serviceurl, {
 *   authentication: ArcGISIdentityManager,
 *   updateDefinition: serviceDefinition
 * });
 * ```
 *
 * @param url - URL of feature service
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with success or error
 */
export declare function updateServiceDefinition(url: string, requestOptions: IUpdateServiceDefinitionOptions): Promise<IUpdateServiceDefinitionResult>;
