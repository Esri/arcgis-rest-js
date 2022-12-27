/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
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
export function updateFeatures(requestOptions) {
    const url = `${cleanUrl(requestOptions.url)}/updateFeatures`;
    // edit operations are POST only
    const options = appendCustomParams(requestOptions, [
        "features",
        "gdbVersion",
        "returnEditMoment",
        "rollbackOnFailure",
        "trueCurveClient"
    ], { params: Object.assign({}, requestOptions.params) });
    return request(url, options);
}
//# sourceMappingURL=update.js.map