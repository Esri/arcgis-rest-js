"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getService = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Feature Service request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/feature-service.htm) for more information.
 *
 * ```js
 * import { getService } from '@esri/arcgis-rest-feature-service';
 * //
 * getService({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer"
 * })
 *   .then(response) // { name: "311", id: 0, ... }
 * ```
 *
 * @param options - Options for the request.
 * @returns A Promise that will resolve with the getService response.
 */
function getService(options) {
    return (0, arcgis_rest_request_1.request)((0, arcgis_rest_request_1.cleanUrl)(options.url), options);
}
exports.getService = getService;
//# sourceMappingURL=getService.js.map