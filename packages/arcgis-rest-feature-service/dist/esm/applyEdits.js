/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
/**
 * Apply edits request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/apply-edits-feature-service-layer-.htm) for more information.
 *
 * ```js
 * import { applyEdits } from '@esri/arcgis-rest-feature-service';
 * //
 * applyEdits({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   adds: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }],
 *   updates: [{
 *     attributes: { OBJECTID: 1004, status: "alive" }
 *   }],
 *   deletes: [862, 1548]
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the applyEdits response.
 */
export function applyEdits(requestOptions) {
    const url = `${cleanUrl(requestOptions.url)}/applyEdits`;
    // edit operations are POST only
    const options = appendCustomParams(requestOptions, [
        "adds",
        "updates",
        "deletes",
        "useGlobalIds",
        "attachments",
        "gdbVersion",
        "returnEditMoment",
        "rollbackOnFailure",
        "trueCurveClient"
    ], { params: Object.assign({}, requestOptions.params) });
    return request(url, options);
}
//# sourceMappingURL=applyEdits.js.map