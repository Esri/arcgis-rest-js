/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
import { ARCGIS_ONLINE_GEOENRICHMENT_URL } from "./helpers.js";
/**
 * Used to get facts about a location or area. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/enrich.htm) for more information.
 *
 * ```js
 * import { queryDemographicData } from '@esri/arcgis-rest-demographics';
 * //
 * queryDemographicData({
 *  studyAreas: [{"geometry":{"x":-117.1956,"y":34.0572}}],
 *  authentication
 * })
 *   .then((response) => {
 *     response; // => { results: [ ... ] }
 *   });
 * ```
 *
 * @param requestOptions Options to pass through to the service.
 * @returns A Promise that will resolve with results for the request.
 */
export function queryDemographicData(requestOptions) {
    const options = appendCustomParams(requestOptions, [
        "studyAreas",
        "dataCollections",
        "analysisVariables",
        "addDerivativeVariables",
        "returnGeometry",
        "inSR",
        "outSR"
    ], { params: Object.assign({}, requestOptions.params) });
    // the SAAS service does not support anonymous requests
    if (!requestOptions.authentication) {
        return Promise.reject("Geoenrichment using the ArcGIS service requires authentication");
    }
    // These parameters are passed as JSON-style strings:
    ["dataCollections", "analysisVariables"].forEach((parameter) => {
        if (options.params[parameter]) {
            options.params[parameter] = JSON.stringify(options.params[parameter]);
        }
    });
    // add spatialReference property to individual matches
    return request(`${cleanUrl(`${requestOptions.endpoint || ARCGIS_ONLINE_GEOENRICHMENT_URL}/enrich`)}`, options).then((response) => {
        return response;
    });
}
//# sourceMappingURL=queryDemographicData.js.map