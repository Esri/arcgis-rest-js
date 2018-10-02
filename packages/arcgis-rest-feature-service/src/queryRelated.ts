/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ISpatialReference,
  IFeature,
  IHasZM,
  esriGeometryType,
  IField
} from "@esri/arcgis-rest-common-types";
import { request } from "@esri/arcgis-rest-request";
import {
  IFeatureRequestOptions,
  IQueryJSONFormatParams,
  IQueryGeoJSONFormatParams,
  appendCustomParams
} from "./helpers";

/**
 * Related record query request options. Additional arguments can be passed via the [params](/arcgis-rest-js/api/feature-service/IQueryRelatedRequestOptions/#params) property. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-related-feature-service-.htm) for more information and a full list of parameters.
 */
export interface IQueryRelatedRequestOptions<
  P extends
    | IQueryJSONFormatParams
    | IQueryGeoJSONFormatParams = IQueryJSONFormatParams
> extends IFeatureRequestOptions<P> {
  url: string;
  relationshipId?: number;
  objectIds?: number[];
  outFields?: "*" | string[];
  definitionExpression?: string;
  params?: P;
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
  geometryType?: esriGeometryType;
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
 * const url = "http://services.myserver/OrgID/ArcGIS/rest/services/Petroleum/KSPetro/FeatureServer/0"
 *
 * queryRelated({
 *  url: url,
 *  relationshipId: 1,
 *  params: { returnCountOnly: true }
 * })
 *  .then(response => {
 *    console.log(response.relatedRecords)
 *  })
 * ```
 *
 * @param requestOptions
 * @returns A Promise that will resolve with the query response
 */
export function queryRelated(
  requestOptions: IQueryRelatedRequestOptions<IQueryJSONFormatParams>
): Promise<IQueryRelatedResponse>;
export function queryRelated(
  requestOptions: IQueryRelatedRequestOptions<IQueryGeoJSONFormatParams>
): Promise<GeoJSON.FeatureCollection>;
export function queryRelated(
  requestOptions: IQueryRelatedRequestOptions<
    IQueryJSONFormatParams | IQueryGeoJSONFormatParams
  >
): Promise<IQueryRelatedResponse | GeoJSON.FeatureCollection> {
  const options: IQueryRelatedRequestOptions<
    IQueryJSONFormatParams | IQueryGeoJSONFormatParams
  > = {
    httpMethod: "GET",
    url: requestOptions.url,
    ...requestOptions
  };

  appendCustomParams(requestOptions, options);

  if (!options.params.definitionExpression) {
    options.params.definitionExpression = "1=1";
  }

  if (!options.params.outFields) {
    options.params.outFields = "*";
  }

  if (!options.params.relationshipId) {
    options.params.relationshipId = 0;
  }

  return request(`${options.url}/queryRelatedRecords`, options);
}
