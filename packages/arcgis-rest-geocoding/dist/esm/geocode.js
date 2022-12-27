/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
import { ARCGIS_ONLINE_GEOCODING_URL } from "./helpers.js";
import { arcgisToGeoJSON } from "@terraformer/arcgis";
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
export function geocode(address) {
    let options = {};
    let endpoint;
    if (typeof address === "string") {
        options.params = { singleLine: address };
        endpoint = ARCGIS_ONLINE_GEOCODING_URL;
    }
    else {
        endpoint = address.endpoint || ARCGIS_ONLINE_GEOCODING_URL;
        options = appendCustomParams(address, [
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
    return request(`${cleanUrl(endpoint)}/findAddressCandidates`, options).then((response) => {
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
                    geometry: arcgisToGeoJSON(candidate.location),
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
//# sourceMappingURL=geocode.js.map