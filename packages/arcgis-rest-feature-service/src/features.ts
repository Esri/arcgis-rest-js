/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  esriGeometryType,
  IFeature,
  IField,
  IGeometry,
  ISpatialReference
} from "@esri/arcgis-rest-common-types";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * parameters required to get a feature by id
 *
 * @param url - layer service url
 * @param id - feature id
 */
export interface IFeatureRequestOptions extends IRequestOptions {
  url: string;
  id: number;
}

/**
 * @param statisticType - statistical operation to perform (count, sum, min, max, avg, stddev, var)
 * @param onStatisticField - field on which to perform the statistical operation
 * @param outStatisticFieldName - a field name for the returned statistic field. If outStatisticFieldName is empty or missing, the server will assign one. A valid field name can only contain alphanumeric characters and an underscore. If the outStatisticFieldName is a reserved keyword of the underlying DBMS, the operation can fail. Try specifying an alternative outStatisticFieldName.
 */
export interface IStatisticDefinition {
  statisticType: "count" | "sum" | "min" | "max" | "avg" | "stddev" | "var";
  onStatisticField: string;
  outStatisticFieldName: string;
}

/**
 * feature query parameters
 *
 * See https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm
 */
export interface IQueryFeaturesParams {
  // TODO: are _any_ of these required?
  where?: string;
  objectIds?: [number];
  geometry?: IGeometry;
  geometryType?: esriGeometryType;
  // NOTE: either WKID or ISpatialReference
  inSR?: string | ISpatialReference;
  spatialRel?:
    | "esriSpatialRelIntersects"
    | "esriSpatialRelContains"
    | "esriSpatialRelCrosses"
    | "esriSpatialRelEnvelopeIntersects"
    | "esriSpatialRelIndexIntersects"
    | "esriSpatialRelOverlaps"
    | "esriSpatialRelTouches"
    | "esriSpatialRelWithin";
  relationParam?: string;
  // NOTE: either time=1199145600000 or time=1199145600000, 1230768000000
  time?: Date | [Date];
  distance?: number;
  units?:
    | "esriSRUnit_Meter"
    | "esriSRUnit_StatuteMile"
    | "esriSRUnit_Foot"
    | "esriSRUnit_Kilometer"
    | "esriSRUnit_NauticalMile"
    | "esriSRUnit_USNauticalMile";
  outFields?: "*" | [string];
  returnGeometry?: boolean;
  maxAllowableOffset?: number;
  geometryPrecision?: number;
  // NOTE: either WKID or ISpatialReference
  outSR?: string | ISpatialReference;
  gdbVersion?: string;
  returnDistinctValues?: boolean;
  returnIdsOnly?: boolean;
  returnCountOnly?: boolean;
  returnExtentOnly?: boolean;
  orderByFields?: string;
  groupByFieldsForStatistics?: string;
  outStatistics?: [IStatisticDefinition];
  returnZ?: boolean;
  returnM?: boolean;
  multipatchOption?: "xyFootprint";
  resultOffset?: number;
  resultRecordCount?: number;
  // TODO: IQuantizationParameters?
  quantizationParameters?: any;
  returnCentroid?: boolean;
  resultType?: "none" | "standard" | "tile";
  // TODO: is Date the right type for epoch time in milliseconds?
  historicMoment?: Date;
  returnTrueCurves?: false;
  sqlFormat?: "none" | "standard" | "native";
  returnExceededLimitFeatures?: boolean;
}

/**
 * feature query request options
 *
 * @param url - layer service url
 * @param params - query parameters to be sent to the feature service
 */
export interface IQueryFeaturesRequestOptions extends IRequestOptions {
  url: string;
  params?: IQueryFeaturesParams;
}

export interface IQueryFeaturesResponse {
  objectIdFieldName: string;
  globalIdFieldName: string;
  geometryType: esriGeometryType;
  spatialReference: ISpatialReference;
  fields: [IField];
  features: [IFeature];
}

/**
 * Get a feature by id
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the feature.
 */
export function getFeature(
  requestOptions: IFeatureRequestOptions
): Promise<IFeature> {
  const url = `${requestOptions.url}/${requestOptions.id}`;

  // default to a GET request
  const options: IFeatureRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options).then((response: any) => response.feature);
}

/**
 * Query features
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the query response.
 */
export function queryFeatures(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<IQueryFeaturesResponse> {
  // set default query parameters
  // and default to a GET request
  const options: IQueryFeaturesRequestOptions = {
    ...{
      params: {},
      httpMethod: "GET"
    },
    ...requestOptions
  };
  if (!options.params.where) {
    options.params.where = "1=1";
  }
  if (!options.params.outFields) {
    options.params.outFields = "*";
  }
  // TODO: do we need to serialize any of the array/object params?
  return request(`${requestOptions.url}/query`, options);
}
