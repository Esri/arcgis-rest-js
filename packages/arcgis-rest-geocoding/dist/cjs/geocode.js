"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocode = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
const arcgis_1 = require("@terraformer/arcgis");
/**
 * Used to determine the location of a single address or point of interest. See the [REST Documentation](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm) for more information.
 *
 *  ```js
 * import { geocode } from '@esri/arcgis-rest-geocoding';
 *
 * geocode("LAX")
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -118.409, y: 33.943, spatialReference: ...  }
 *   });
 *
 * geocode({
 *   address: "1600 Pennsylvania Ave",
 *   postal: 20500,
 *   countryCode: "USA"
 * })
 *   .then((response) => {
 *     response.candidates[1].location; // => { x: -77.036533, y: 38.898719, spatialReference: ... }
 *   });
 * ```
 *
 * @param address String representing the address or point of interest or RequestOptions to pass to the endpoint.
 * @returns A Promise that will resolve with address candidates for the request. The spatial reference will be added to candidate locations and extents unless `rawResponse: true` was passed.
 */
function geocode(address) {
    let options = {};
    let endpoint;
    if (typeof address === "string") {
        options.params = { singleLine: address };
        endpoint = helpers_js_1.ARCGIS_ONLINE_GEOCODING_URL;
    }
    else {
        endpoint = address.endpoint || helpers_js_1.ARCGIS_ONLINE_GEOCODING_URL;
        options = (0, arcgis_rest_request_1.appendCustomParams)(address, [
            "singleLine",
            "address",
            "address2",
            "address3",
            "neighborhood",
            "city",
            "subregion",
            "region",
            "postal",
            "postalExt",
            "countryCode",
            "outFields",
            "magicKey"
        ], { params: Object.assign({}, address.params) });
    }
    // add spatialReference property to individual matches
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(endpoint)}/findAddressCandidates`, options).then((response) => {
        if (typeof address !== "string" && address.rawResponse) {
            return response;
        }
        const sr = response.spatialReference;
        response.candidates.forEach(function (candidate) {
            candidate.location.spatialReference = sr;
            if (candidate.extent) {
                candidate.extent.spatialReference = sr;
            }
        });
        // geoJson
        if (sr.wkid === 4326) {
            const features = response.candidates.map((candidate) => {
                return {
                    type: "Feature",
                    geometry: (0, arcgis_1.arcgisToGeoJSON)(candidate.location),
                    properties: Object.assign({
                        address: candidate.address,
                        score: candidate.score
                    }, candidate.attributes)
                };
            });
            response.geoJson = {
                type: "FeatureCollection",
                features
            };
        }
        return response;
    });
}
exports.geocode = geocode;
//# sourceMappingURL=geocode.js.map