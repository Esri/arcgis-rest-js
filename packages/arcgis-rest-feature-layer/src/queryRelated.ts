/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import {
  ISpatialReference,
  IFeature,
  IHasZM,
  GeometryType,
  IField
} from "@esri/arcgis-rest-types";

import { IGetLayerOptions } from "./helpers.js";

/**
 * Related record query request options. Additional arguments can be passed via the [params](/arcgis-rest-js/api/feature-service/IQueryRelatedOptions/#params) property. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-related-feature-service-.htm) for more information and a full list of parameters.
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
 *
 * ```js
 * import { queryRelated } from '@esri/arcgis-rest-feature-layer'
 * //
 * queryRelated({
 *  url: "http://services.myserver/OrgID/ArcGIS/rest/services/Petroleum/KSPetro/FeatureServer/0",
 *  relationshipId: 1,
 *  params: { returnCountOnly: true }
 * })
 *  .then(response) // response.relatedRecords
 * ```
 * Query the related records for a feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-related-records-feature-service-.htm) for more information.
 *
 * @param requestOptions
 * @returns A Promise that will resolve with the query response
 */
export function queryRelated(
  requestOptions: IQueryRelatedOptions
): Promise<IQueryRelatedResponse> {
  const options = appendCustomParams<IQueryRelatedOptions>(
    requestOptions,
    ["objectIds", "relationshipId", "definitionExpression", "outFields"],
    {
      httpMethod: "GET",
      params: {
        // set default query parameters
        definitionExpression: "1=1",
        outFields: "*",
        relationshipId: 0,
        ...requestOptions.params
      }
    }
  );

  return request(
    `${cleanUrl(requestOptions.url)}/queryRelatedRecords`,
    options
  );
}
