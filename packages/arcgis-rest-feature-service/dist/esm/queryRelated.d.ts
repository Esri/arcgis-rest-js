import { ISpatialReference, IFeature, IHasZM, GeometryType, IField } from "@esri/arcgis-rest-request";
import { IGetLayerOptions } from "./helpers.js";
/**
 * Related record query request options. Additional arguments can be passed via the {@linkcode IQueryRelatedOptions.params} property. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-related-records-feature-service-.htm) for more information and a full list of parameters.
 */
export interface IQueryRelatedOptions extends IGetLayerOptions {
    relationshipId?: number;
    objectIds?: number[];
    outFields?: "*" | string[];
    definitionExpression?: string;
}
/**
 * Related record data structure
 */
export interface IRelatedRecordGroup {
    objectId: number;
    relatedRecords?: IFeature[];
    count?: number;
}
/**
 * Related record response structure
 */
export interface IQueryRelatedResponse extends IHasZM {
    geometryType?: GeometryType;
    spatialReference?: ISpatialReference;
    fields?: IField[];
    relatedRecordGroups: IRelatedRecordGroup[];
}
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
export declare function queryRelated(requestOptions: IQueryRelatedOptions): Promise<IQueryRelatedResponse>;
