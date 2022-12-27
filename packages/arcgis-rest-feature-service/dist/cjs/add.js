"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFeatures = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
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
function addFeatures(requestOptions) {
    const url = `${(0, arcgis_rest_request_1.cleanUrl)(requestOptions.url)}/addFeatures`;
    // edit operations are POST only
    const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, ["features", "gdbVersion", "returnEditMoment", "rollbackOnFailure"], { params: Object.assign({}, requestOptions.params) });
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.addFeatures = addFeatures;
//# sourceMappingURL=add.js.map