/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
import { ARCGIS_ONLINE_GEOENRICHMENT_URL } from "./helpers.js";
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
export function getAvailableGeographyLevels(requestOptions) {
    let options = {};
    let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/StandardGeographyLevels`;
    if (!requestOptions) {
        options.params = {};
    }
    else {
        if (requestOptions.endpoint) {
            endpoint = `${requestOptions.endpoint}/StandardGeographyLevels`;
        }
        options = appendCustomParams(requestOptions, [], {
            params: Object.assign({}, requestOptions.params)
        });
    }
    return request(`${cleanUrl(endpoint)}`, options).then((response) => {
        return response;
    });
}
//# sourceMappingURL=getAvailableGeographyLevels.js.map