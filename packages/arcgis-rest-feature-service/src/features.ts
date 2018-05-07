/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  esriGeometryType,
  SpatialRelationship,
  IFeature,
  IField,
  IGeometry,
  ISpatialReference,
  IFeatureSet
} from "@esri/arcgis-rest-common-types";
import { request, IRequestOptions, IParams } from "@esri/arcgis-rest-request";

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

export interface ISharedQueryParams extends IParams {
  where?: string;
  geometry?: IGeometry;
  geometryType?: esriGeometryType;
  // NOTE: either WKID or ISpatialReference
  inSR?: string | ISpatialReference;
  spatialRel?: SpatialRelationship;
}

/**
 * feature query parameters
 *
 * See https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm
 */
export interface IQueryFeaturesParams extends ISharedQueryParams {
  objectIds?: number[];
  // NOTE: either WKID or ISpatialReference
  relationParam?: string;
  // NOTE: either time=1199145600000 or time=1199145600000, 1230768000000
  time?: Date | Date[];
  distance?: number;
  units?:
    | "esriSRUnit_Meter"
    | "esriSRUnit_StatuteMile"
    | "esriSRUnit_Foot"
    | "esriSRUnit_Kilometer"
    | "esriSRUnit_NauticalMile"
    | "esriSRUnit_USNauticalMile";
  outFields?: "*" | string[];
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
  outStatistics?: IStatisticDefinition[];
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

export interface IQueryFeaturesResponse extends IFeatureSet {
  exceededTransferLimit?: boolean;
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
  // default to a GET request
  const options: IQueryFeaturesRequestOptions = {
    ...{
      params: {},
      httpMethod: "GET"
    },
    ...requestOptions
  };
  // set default query parameters
  if (!options.params.where) {
    options.params.where = "1=1";
  }
  if (!options.params.outFields) {
    options.params.outFields = "*";
  }
  return request(`${requestOptions.url}/query`, options);
}

/**
 * add, update and delete features results
 */
export interface IEditFeatureResult {
  objectId: number;
  globalId?: string;
  success: boolean;
}

/**
 * add and update features update parameters
 */
export interface IEditFeaturesParams extends IParams {
  gdbVersion?: string;
  returnEditMoment?: boolean;
  rollbackOnFailure?: boolean;
}

/**
 * add features request options
 *
 * @param url - layer service url
 * @param params - query parameters to be sent to the feature service
 */
export interface IAddFeaturesRequestOptions extends IRequestOptions {
  url: string;
  adds: IFeature[];
  params?: IEditFeaturesParams;
}

/**
 * add features results
 */
export interface IAddFeaturesResult {
  addResults?: IEditFeatureResult[];
}

/**
 * Add features
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the addFeatures response.
 */
export function addFeatures(
  requestOptions: IAddFeaturesRequestOptions
): Promise<IAddFeaturesResult> {
  const url = `${requestOptions.url}/addFeatures`;

  // edit operations are POST only
  const options: IAddFeaturesRequestOptions = {
    params: {},
    ...requestOptions
  };

  // mixin, don't overwrite
  options.params.features = requestOptions.adds;

  return request(url, options);
}

/**
 * update features request options
 *
 * @param url - layer service url
 * @param params - query parameters to be sent to the feature service
 */
export interface IUpdateFeaturesRequestOptions extends IRequestOptions {
  url: string;
  updates: IFeature[];
  params?: IEditFeaturesParams;
}

/**
 * update features results
 */
export interface IUpdateFeaturesResult {
  updateResults?: IEditFeatureResult[];
}

/**
 * Update features
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the updateFeatures response.
 */
export function updateFeatures(
  requestOptions: IUpdateFeaturesRequestOptions
): Promise<IUpdateFeaturesResult> {
  const url = `${requestOptions.url}/updateFeatures`;

  // edit operations are POST only
  const options: IUpdateFeaturesRequestOptions = {
    params: {},
    ...requestOptions
  };

  // mixin, don't overwrite
  options.params.features = requestOptions.updates;

  return request(url, options);
}

/**
 * delete features parameters
 */
export interface IDeleteFeaturesParams
  extends IEditFeaturesParams,
    ISharedQueryParams {}

/**
 * delete features request options
 *
 * @param url - layer service url
 * @param params - query parameters to be sent to the feature service
 */
export interface IDeleteFeaturesRequestOptions extends IRequestOptions {
  url: string;
  deletes: number[];
  params?: IDeleteFeaturesParams;
}

/**
 * update features results
 */
export interface IDeleteFeaturesResult {
  deleteResults?: IEditFeatureResult[];
}

/**
 * Delete features
 *
 * @param deleteFeaturesRequestOptions - Options for the request
 * @returns A Promise that will resolve with the deleteFeatures response.
 */
export function deleteFeatures(
  requestOptions: IDeleteFeaturesRequestOptions
): Promise<IDeleteFeaturesResult> {
  const url = `${requestOptions.url}/deleteFeatures`;

  // edit operations POST only
  const options: IDeleteFeaturesRequestOptions = {
    params: {},
    ...requestOptions
  };

  // mixin, don't overwrite
  options.params.objectIds = requestOptions.deletes;

  return request(url, options);
}
