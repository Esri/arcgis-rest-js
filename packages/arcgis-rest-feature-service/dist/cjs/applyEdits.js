"use strict";
/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyEdits = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
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
function applyEdits(requestOptions) {
    const url = `${(0, arcgis_rest_request_1.cleanUrl)(requestOptions.url)}/applyEdits`;
    // edit operations are POST only
    const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [
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
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.applyEdits = applyEdits;
//# sourceMappingURL=applyEdits.js.map