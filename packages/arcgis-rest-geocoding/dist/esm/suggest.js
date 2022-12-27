/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl } from "@esri/arcgis-rest-request";
import { ARCGIS_ONLINE_GEOCODING_URL } from "./helpers.js";
/**
 * Used to return a placename [suggestion](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm) for a partial string.
 *
 * ```js
 * import { suggest } from '@esri/arcgis-rest-geocoding';
 * //
 * suggest("Starb")
 *   .then(response) // response.text === "Starbucks"
 * ```
 *
 * @param requestOptions - Options for the request including authentication and other optional parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
export function suggest(partialText, requestOptions) {
    const options = Object.assign({ endpoint: ARCGIS_ONLINE_GEOCODING_URL, params: {} }, requestOptions);
    options.params.text = partialText;
    return request(`${cleanUrl(options.endpoint)}/suggest`, options);
}
export default {
    suggest
};
//# sourceMappingURL=suggest.js.map