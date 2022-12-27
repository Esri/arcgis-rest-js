"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkGeocode = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
/**
 * Used to geocode a [batch](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-geocode-addresses.htm) of addresses.
 *
 * ```js
 * import { bulkGeocode } from '@esri/arcgis-rest-geocoding';
 * import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request';
 *
 * const addresses = [
 *   { "OBJECTID": 1, "SingleLine": "380 New York Street 92373" },
 *   { "OBJECTID": 2, "SingleLine": "1 World Way Los Angeles 90045" }
 * ];
 *
 * bulkGeocode({ addresses, authentication: session })
 *   .then((response) => {
 *     response.locations[0].location; // => { x: -117, y: 34, spatialReference: { wkid: 4326 } }
 *   });
 * ```
 *
 * @param requestOptions - Request options to pass to the geocoder, including an array of addresses and authentication session.
 * @returns A Promise that will resolve with the data from the response. The spatial reference will be added to address locations unless `rawResponse: true` was passed.
 */
function bulkGeocode(requestOptions // must POST, which is the default
) {
    const options = Object.assign({ endpoint: helpers_js_1.ARCGIS_ONLINE_BULK_GEOCODING_URL, params: {} }, requestOptions);
    options.params.addresses = {
        records: requestOptions.addresses.map((address) => {
            return { attributes: address };
        })
    };
    // the SAS service does not support anonymous requests
    if (!requestOptions.authentication &&
        options.endpoint === helpers_js_1.ARCGIS_ONLINE_BULK_GEOCODING_URL) {
        return Promise.reject("bulk geocoding using the ArcGIS service requires authentication");
    }
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(options.endpoint)}/geocodeAddresses`, options).then((response) => {
        if (options.rawResponse) {
            return response;
        }
        const sr = response.spatialReference;
        response.locations.forEach(function (address) {
            if (address.location) {
                address.location.spatialReference = sr;
            }
        });
        return response;
    });
}
exports.bulkGeocode = bulkGeocode;
//# sourceMappingURL=bulk.js.map