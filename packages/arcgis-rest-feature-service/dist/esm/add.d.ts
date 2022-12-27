import { IFeature } from "@esri/arcgis-rest-request";
import { ISharedEditOptions, IEditFeatureResult } from "./helpers.js";
/**
 * Add features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-features.htm) for more information.
 *
 */
export interface IAddFeaturesOptions extends ISharedEditOptions {
    /**
     * Array of JSON features to add.
     */
    features: IFeature[];
}
/**
 * Add features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-features.htm) for more information.
 *
 * ```js
 * import { addFeatures } from '@esri/arcgis-rest-feature-service';
 * //
 * addFeatures({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   features: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export declare function addFeatures(requestOptions: IAddFeaturesOptions): Promise<{
    addResults: IEditFeatureResult[];
}>;
