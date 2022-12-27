"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeatures = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
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
function updateFeatures(requestOptions) {
    const url = `${(0, arcgis_rest_request_1.cleanUrl)(requestOptions.url)}/updateFeatures`;
    // edit operations are POST only
    const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [
        "features",
        "gdbVersion",
        "returnEditMoment",
        "rollbackOnFailure",
        "trueCurveClient"
    ], { params: Object.assign({}, requestOptions.params) });
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.updateFeatures = updateFeatures;
//# sourceMappingURL=update.js.map