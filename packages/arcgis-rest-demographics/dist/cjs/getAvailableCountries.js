"use strict";
/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableCountries = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
/**
 * Return a list of information for all countries. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/countries.htm) for more information.
 *
 * ```js
 * import { getAvailableCountries } from '@esri/arcgis-rest-demographics';
 *
 * getAvailableCountries()
 *   .then((response) => {
 *     response; // => { countries: [ ... ]  }
 *   });
 * ```
 *
 * @param requestOptions Options to pass through to the geoenrichment service.
 * @returns A Promise that will resolve with available geography levels for the request.
 */
function getAvailableCountries(requestOptions) {
    let options = {};
    let endpoint = `${helpers_js_1.ARCGIS_ONLINE_GEOENRICHMENT_URL}/countries`;
    if (!requestOptions) {
        options.params = {};
    }
    else {
        if (requestOptions.endpoint) {
            endpoint = `${requestOptions.endpoint}/countries`;
        }
        options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [], { params: Object.assign({}, requestOptions.params) });
        if (requestOptions.countryCode) {
            endpoint = `${endpoint}/${requestOptions.countryCode}`;
        }
    }
    return (0, arcgis_rest_request_1.request)((0, arcgis_rest_request_1.cleanUrl)(endpoint), options).then((response) => {
        return response;
    });
}
exports.getAvailableCountries = getAvailableCountries;
//# sourceMappingURL=getAvailableCountries.js.map