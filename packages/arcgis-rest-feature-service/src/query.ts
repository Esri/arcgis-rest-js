/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ISpatialReference,
  IFeatureSet,
  IFeature,
  esriUnits,
  IExtent
} from "@esri/arcgis-rest-common-types";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import { ISharedQueryParams, appendCustomParams } from "./helpers";
/**
 * Request options to fetch a feature by id.
 */
export interface IFeatureRequestOptions extends IRequestOptions {
  /**
   * Layer service url.
   */
  url: string;
  /**
   * Unique identifier of the feature.
   */
  id: number;
}

export interface IStatisticDefinition {
  /**
   * Statistical operation to perform (count, sum, min, max, avg, stddev, var).
   */
  statisticType: "count" | "sum" | "min" | "max" | "avg" | "stddev" | "var";
  /**
   * Field on which to perform the statistical operation.
   */
  onStatisticField: string;
  /**
   * Field name for the returned statistic field. If outStatisticFieldName is empty or missing, the server will assign one. A valid field name can only contain alphanumeric characters and an underscore. If the outStatisticFieldName is a reserved keyword of the underlying DBMS, the operation can fail. Try specifying an alternative outStatisticFieldName.
   */
  outStatisticFieldName: string;
}

/**
 * feature query request options. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 */
export interface IQueryFeaturesRequestOptions
  extends ISharedQueryParams,
    IRequestOptions {
  /**
   * Layer service url.
   */
  url: string;
  objectIds?: number[];
  relationParam?: string;
  // NOTE: either time=1199145600000 or time=1199145600000, 1230768000000
  time?: number | number[];
  distance?: number;
  units?: esriUnits;
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
  // to do: convert from Date() to epoch time internally
  historicMoment?: number;
  returnTrueCurves?: false;
  sqlFormat?: "none" | "standard" | "native";
  returnExceededLimitFeatures?: boolean;
}

export interface IQueryFeaturesResponse extends IFeatureSet {
  exceededTransferLimit?: boolean;
}

export interface IQueryResponse {
  count?: number;
  extent?: IExtent;
  objectIdFieldName?: string;
  objectIds?: number[];
}

/**
 * Get a feature by id.
 *
 * ```js
 * import { getFeature } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
 *
 * getFeature({
 *   url,
 *   id: 42
 * }).then(feature => {
 *  console.log(feature.attributes.FID); // 42
 * });
 * ```
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
 * Query a feature service. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 *
 * ```js
 * import { queryFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
 *
 * queryFeatures({
 *   url,
 *   where: "STATE_NAME = 'Alaska"
 * }).then(result => {
 *   console.log(result.features); // array of features
 * });
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the query response.
 */
export function queryFeatures(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<IQueryFeaturesResponse | IQueryResponse> {
  // default to a GET request
  const options: IQueryFeaturesRequestOptions = {
    params: {},
    httpMethod: "GET",
    url: requestOptions.url,
    ...requestOptions
  };

  appendCustomParams(requestOptions, options);

  // set default query parameters
  if (!options.params.where) {
    options.params.where = "1=1";
  }
  if (!options.params.outFields) {
    options.params.outFields = "*";
  }
  return request(`${options.url}/query`, options);
}
