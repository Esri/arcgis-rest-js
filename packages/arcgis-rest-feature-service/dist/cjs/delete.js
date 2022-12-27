"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeatures = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
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
function deleteFeatures(requestOptions) {
    const url = `${(0, arcgis_rest_request_1.cleanUrl)(requestOptions.url)}/deleteFeatures`;
    // edit operations POST only
    const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [
        "where",
        "objectIds",
        "gdbVersion",
        "returnEditMoment",
        "rollbackOnFailure"
    ], { params: Object.assign({}, requestOptions.params) });
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.deleteFeatures = deleteFeatures;
//# sourceMappingURL=delete.js.map