/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl, appendCustomParams } from "@esri/arcgis-rest-request";
/**
 * Query the related records for a feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-related-records-feature-service-.htm) for more information.
 *
 * ```js
 * import { queryRelated } from '@esri/arcgis-rest-feature-service'
 *
 * queryRelated({
 *  url: "http://services.myserver/OrgID/ArcGIS/rest/services/Petroleum/KSPetro/FeatureServer/0",
 *  relationshipId: 1,
 *  params: { returnCountOnly: true }
 * })
 *  .then(response) // response.relatedRecords
 * ```
 *
 * @param requestOptions
 * @returns A Promise that will resolve with the query response
 */
export function queryRelated(requestOptions) {
    const options = appendCustomParams(requestOptions, ["objectIds", "relationshipId", "definitionExpression", "outFields"], {
        httpMethod: "GET",
        params: Object.assign({ 
            // set default query parameters
            definitionExpression: "1=1", outFields: "*", relationshipId: 0 }, requestOptions.params)
    });
    return request(`${cleanUrl(requestOptions.url)}/queryRelatedRecords`, options);
}
//# sourceMappingURL=queryRelated.js.map