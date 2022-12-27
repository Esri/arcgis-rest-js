import { ISharedEditOptions, IEditFeatureResult, ISharedQueryOptions } from "./helpers.js";
/**
 * Delete features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
 *
 */
export interface IDeleteFeaturesOptions extends ISharedEditOptions, ISharedQueryOptions {
    /**
     * Array of objectIds to delete.
     */
    objectIds: number[];
}
/**
 * Delete features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
 *
 * ```js
 * import { deleteFeatures } from '@esri/arcgis-rest-feature-service';
 * //
 * deleteFeatures({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   objectIds: [1,2,3]
 * });
 * ```
 *
 * @param deleteFeaturesRequestOptions - Options for the request.
 * @returns A Promise that will resolve with the deleteFeatures response.
 */
export declare function deleteFeatures(requestOptions: IDeleteFeaturesOptions): Promise<{
    deleteResults: IEditFeatureResult[];
}>;
