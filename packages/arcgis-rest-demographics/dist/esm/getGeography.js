/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
import { ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL } from "./helpers.js";
/**
 * Used to get standard geography IDs and features for the supported geographic levels. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-query.htm) and the [best practices post](https://www.esri.com/arcgis-blog/products/arcgis-online/uncategorized/best-practices-how-to-query-standard-geographies-branches) for more information.
 *
 * ```js
 * import { getGeography } from '@esri/arcgis-rest-demographics';
 * //
 * getGeography({
 *   sourceCountry: "CA",
 *   geographyIDs: ["35"]
 * })
 *   .then((response) => {
 *     response.; // => { results: [ ... ] }
 *   });
 * ```
 *
 * @param requestOptions Options to pass through to the service. All properties are optional, but either `geographyIds` or `geographyQuery` must be sent at a minimum.
 * @returns A Promise that will resolve with return data defined and optionally geometry for the feature.
 */
export function getGeography(requestOptions) {
    const endpoint = `${requestOptions.endpoint || ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL}/execute`;
    const options = appendCustomParams(requestOptions, [
        "sourceCountry",
        "optionalCountryDataset",
        "geographyLayers",
        "geographyIDs",
        "geographyQuery",
        "returnSubGeographyLayer",
        "subGeographyLayer",
        "subGeographyQuery",
        "outSR",
        "returnGeometry",
        "returnCentroids",
        "generalizationLevel",
        "useFuzzySearch",
        "featureLimit",
        "featureOffset",
        "langCode"
    ], { params: Object.assign({}, requestOptions.params) });
    // the SAAS service does not support anonymous requests
    if (!requestOptions.authentication) {
        return Promise.reject("Geoenrichment using the ArcGIS service requires authentication");
    }
    // These parameters are passed as JSON-style strings:
    ["geographyLayers", "geographyIDs"].forEach((parameter) => {
        if (options.params[parameter]) {
            options.params[parameter] = JSON.stringify(options.params[parameter]);
        }
    });
    // add spatialReference property to individual matches
    return request(`${cleanUrl(endpoint)}`, options).then((response) => {
        return response;
    });
}
//# sourceMappingURL=getGeography.js.map