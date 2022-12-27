"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggest = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
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
function suggest(partialText, requestOptions) {
    const options = Object.assign({ endpoint: helpers_js_1.ARCGIS_ONLINE_GEOCODING_URL, params: {} }, requestOptions);
    options.params.text = partialText;
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(options.endpoint)}/suggest`, options);
}
exports.suggest = suggest;
exports.default = {
    suggest
};
//# sourceMappingURL=suggest.js.map