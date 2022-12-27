"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeocodeService = exports.ARCGIS_ONLINE_BULK_GEOCODING_URL = exports.ARCGIS_ONLINE_GEOCODING_URL = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
// https always
exports.ARCGIS_ONLINE_GEOCODING_URL = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/";
exports.ARCGIS_ONLINE_BULK_GEOCODING_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";
/**
 * Used to fetch metadata from a geocoding service.
 *
 * ```js
 * import { getGeocoderServiceInfo } from '@esri/arcgis-rest-geocoding';
 *
 * getGeocoderServiceInfo()
 *   .then((response) => {
 *     response.serviceDescription; // => 'World Geocoder'
 *   });
 * ```
 *
 * @param requestOptions - Request options can contain a custom geocoding service to fetch metadata from.
 * @returns A Promise that will resolve with the data from the response.
 */
function getGeocodeService(requestOptions) {
    const url = (requestOptions && requestOptions.endpoint) || exports.ARCGIS_ONLINE_GEOCODING_URL;
    const options = Object.assign({ httpMethod: "GET", maxUrlLength: 2000 }, requestOptions);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getGeocodeService = getGeocodeService;
//# sourceMappingURL=helpers.js.map