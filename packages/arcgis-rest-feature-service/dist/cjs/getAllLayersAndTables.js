"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLayersAndTables = void 0;
const tslib_1 = require("tslib");
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
/**
 *  * Fetches all the layers and tables associated with a given layer service.
 * Wrapper for https://developers.arcgis.com/rest/services-reference/all-layers-and-tables.htm
 *
 * ```js
 * import { getAllLayersAndTables } from '@esri/arcgis-rest-feature-service';
 * getAllLayersAndTables({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0"
 * })
 *   .then(response) // { layers: [...], tables: [...] }
 * ```
 *
 * @param options - Request options, including the url for the layer service
 * @returns A Promise that will resolve with the layers and tables for the given service
 */
// TODO: should we expand this to support other valid params of the endpoint?
function getAllLayersAndTables(options) {
    const { url } = options, requestOptions = (0, tslib_1.__rest)(options, ["url"]);
    const layersUrl = `${(0, helpers_js_1.parseServiceUrl)(url)}/layers`;
    return (0, arcgis_rest_request_1.request)(layersUrl, requestOptions);
}
exports.getAllLayersAndTables = getAllLayersAndTables;
//# sourceMappingURL=getAllLayersAndTables.js.map