"use strict";
/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableDataCollections = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
/**
 * Used to determine the data collections available for usage with the Geoenrichment service. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/data-collections.htm) for more information.
 *
 * ```js
 * import { getAvailableDataCollections } from '@esri/arcgis-rest-demographics';
 *
 * getAvailableDataCollections()
 *   .then((response) => {
 *     response; // => { DataCollections: [ ... ]  }
 *   });
 *
 * getAvailableDataCollections({
 *   countryCode: "se",
 *   dataCollection: "EducationalAttainment"
 * })
 *   .then((response) => {
 *     response.; // => { DataCollections: [ ... ] }
 *   });
 * ```
 *
 * @param requestOptions Options to pass through to the geoenrichment service.
 * @returns A Promise that will resolve with data collections for the request.
 */
function getAvailableDataCollections(requestOptions) {
    let options = {};
    let endpoint = `${helpers_js_1.ARCGIS_ONLINE_GEOENRICHMENT_URL}/dataCollections`;
    if (!requestOptions) {
        options.params = {};
    }
    else {
        if (requestOptions.endpoint) {
            endpoint = `${requestOptions.endpoint}/dataCollections`;
        }
        options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, ["addDerivativeVariables", "suppressNullValues"], { params: Object.assign({}, requestOptions.params) });
        if (options.params.addDerivativeVariables) {
            options.params.addDerivativeVariables = JSON.stringify(options.params.addDerivativeVariables);
        }
        if (requestOptions.countryCode) {
            endpoint = `${endpoint}/${requestOptions.countryCode}`;
            if (requestOptions.dataCollection) {
                endpoint = `${endpoint}/${requestOptions.dataCollection}`;
            }
        }
    }
    // add spatialReference property to individual matches
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(endpoint)}`, options).then((response) => {
        return response;
    });
}
exports.getAvailableDataCollections = getAvailableDataCollections;
//# sourceMappingURL=getAvailableDataCollections.js.map