/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
import { ARCGIS_ONLINE_GEOENRICHMENT_URL } from "./helpers.js";
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
export function getAvailableDataCollections(requestOptions) {
    let options = {};
    let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/dataCollections`;
    if (!requestOptions) {
        options.params = {};
    }
    else {
        if (requestOptions.endpoint) {
            endpoint = `${requestOptions.endpoint}/dataCollections`;
        }
        options = appendCustomParams(requestOptions, ["addDerivativeVariables", "suppressNullValues"], { params: Object.assign({}, requestOptions.params) });
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
    return request(`${cleanUrl(endpoint)}`, options).then((response) => {
        return response;
    });
}
//# sourceMappingURL=getAvailableDataCollections.js.map