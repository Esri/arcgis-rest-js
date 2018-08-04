/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ISpatialReference,
  IFeature,
  IHasZM,
  esriGeometryType,
  IField
} from "@esri/arcgis-rest-common-types";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { appendCustomParams } from "./helpers";

/**
 * Query related records request options. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-related-records-feature-service-.htm) for more information.
 */
export interface IQueryRelatedRecordsRequestOptions extends IRequestOptions {
  url: string;
  relationshipId: number;
  objectIds?: number[];
  outFields?: "*" | string[];
  definitionExpression?: string;
  returnGeometry?: boolean;
  maxAllowableOffset?: number;
  geometryPrecision?: number;
  resultOffset?: number;
  resultRecordCount?: number;
  outSR?: string | ISpatialReference;
  gdbVersion?: string;
  historicMoment?: number;
  returnZ?: boolean;
  returnM?: boolean;
  returnTrueCurves?: boolean;
  orderByFields?: string;
  returnCountOnly?: boolean;
}

/**
 * Related record data structure
 */

export interface IRelatedRecordGroups {
  objectId: number;
  relatedRecords?: IFeature[];
  count?: number;
}

/**
 * Related record response structure
 */

export interface IQueryRelatedRecordResponse extends IHasZM {
  geometryType?: esriGeometryType;
  spatialReference?: ISpatialReference;
  fields?: IField[];
  relatedRecordGroups: IRelatedRecordGroups;
}
/**
 * Query the related records for a feature service. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-related-records-feature-service-.htm) for more information.
 *
 * ```js
 * import { queryRelatedRecords } from '@esri/arcgis-rest-feature-service'
 *
 * const url = "http://services.myserver/OrgID/ArcGIS/rest/services/Petroleum/KSPetro/FeatureServer/0"
 *
 * queryRelatedRecords({
 *  url: url,
 *  relationshipId: 1
 * };)
 *  .then(response => {
 *    console.log(response.relatedRecords)
 *  })
 * ```
 *
 * @param requestOptions
 * @returns A Promise that will resolve with the query response
 */
export function queryRelatedRecords(
  requestOptions: IQueryRelatedRecordsRequestOptions
): Promise<IQueryRelatedRecordResponse> {
  const options: IQueryRelatedRecordsRequestOptions = {
    params: {},
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

  return request(`${options.url}/queryRelatedRecords`, options);
}
