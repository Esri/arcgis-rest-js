"use strict";
/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableGeographyLevels = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
/**
 * Returns a list of available geography data layers, which can then be used in [getGeography()](). See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-levels.htm) for more information.
 *
 * ```js
 * import { getAvailableGeographyLevels } from '@esri/arcgis-rest-demographics';
 * //
 * getAvailableGeographyLevels()
 *   .then((response) => {
 *     response; // => { geographyLevels: [ ... ]  }
 *   });
 * ```
 *
 * @param requestOptions Options to pass through to the geoenrichment service.
 * @returns A Promise that will resolve with available geography levels for the request.
 */
function getAvailableGeographyLevels(requestOptions) {
    let options = {};
    let endpoint = `${helpers_js_1.ARCGIS_ONLINE_GEOENRICHMENT_URL}/StandardGeographyLevels`;
    if (!requestOptions) {
        options.params = {};
    }
    else {
        if (requestOptions.endpoint) {
            endpoint = `${requestOptions.endpoint}/StandardGeographyLevels`;
        }
        options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [], {
            params: Object.assign({}, requestOptions.params)
        });
    }
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(endpoint)}`, options).then((response) => {
        return response;
    });
}
exports.getAvailableGeographyLevels = getAvailableGeographyLevels;
//# sourceMappingURL=getAvailableGeographyLevels.js.map