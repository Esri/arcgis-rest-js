import { IFeature } from "@esri/arcgis-rest-request";
import { ISharedEditOptions, IEditFeatureResult } from "./helpers.js";
/**
 * Update features request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/update-features.htm) for more information.
 *
 */
export interface IUpdateFeaturesOptions extends ISharedEditOptions {
    /**
     * Array of JSON features to update.
     */
    features: IFeature[];
    /**
     * Optional parameter which is false by default is set by client to indicate to the server that client in true curve capable.
     */
    trueCurveClient?: boolean;
}
/**
 * Update features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/update-features.htm) for more information.
 *
 * ```js
 * import { updateFeatures } from '@esri/arcgis-rest-feature-service';
 * //
 * updateFeatures({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   features: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the updateFeatures response.
 */
export declare function updateFeatures(requestOptions: IUpdateFeaturesOptions): Promise<{
    updateResults: IEditFeatureResult[];
}>;
