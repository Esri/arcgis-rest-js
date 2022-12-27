/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
import { ARCGIS_ONLINE_GEOENRICHMENT_URL } from "./helpers.js";
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
export function getAvailableCountries(requestOptions) {
    let options = {};
    let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/countries`;
    if (!requestOptions) {
        options.params = {};
    }
    else {
        if (requestOptions.endpoint) {
            endpoint = `${requestOptions.endpoint}/countries`;
        }
        options = appendCustomParams(requestOptions, [], { params: Object.assign({}, requestOptions.params) });
        if (requestOptions.countryCode) {
            endpoint = `${endpoint}/${requestOptions.countryCode}`;
        }
    }
    return request(cleanUrl(endpoint), options).then((response) => {
        return response;
    });
}
//# sourceMappingURL=getAvailableCountries.js.map