/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  esriGeometryType,
  SpatialRelationship,
  IFeature,
  IField,
  IGeometry,
  ISpatialReference,
  IFeatureSet,
  esriUnits
} from "@esri/arcgis-rest-common-types";
import { request, IRequestOptions, IParams } from "@esri/arcgis-rest-request";

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

export interface ISharedQueryParams {
  where?: string;
  geometry?: IGeometry;
  geometryType?: esriGeometryType;
  // NOTE: either WKID or ISpatialReference
  inSR?: string | ISpatialReference;
  spatialRel?: SpatialRelationship;
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
  time?: Date | Date[];
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
  historicMoment?: number;
  returnTrueCurves?: false;
  sqlFormat?: "none" | "standard" | "native";
  returnExceededLimitFeatures?: boolean;
  [key: string]: any; // helper to loop through and pass down to params
}

export interface IQueryFeaturesResponse extends IFeatureSet {
  exceededTransferLimit?: boolean;
}

/**
 * Get a feature by id
 *
 * ```js
 * import { getFeature } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
 *
 * getFeature({
 *   url,
 *   id: 42
 * };)
 *   .then(feature => {
 *     console.log(feature.attributes.FID); // 42
 *   });
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
 * Query features
 *
 * ```js
 * import { queryFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
 *
 * queryFeatures({
 *   url,
 *   where: "STATE_NAME = 'Alaska"
 * };)
 *   .then(feature => {
 *     console.log(feature.attributes.FID); // 42
 *   });
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the query response.
 */
export function queryFeatures(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<IQueryFeaturesResponse> {
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

/**
 * Add, update and delete features result Object.
 */
export interface IEditFeatureResult {
  objectId: number;
  globalId?: string;
  success: boolean;
}

/**
 * Common add and update features parameters.
 */
export interface IEditFeaturesParams {
  /**
   * The geodatabase version to apply the edits.
   */
  gdbVersion?: string;
  /**
   * Optional parameter specifying whether the response will report the time features were added.
   */
  returnEditMoment?: boolean;
  /**
   * Optional parameter to specify if the edits should be applied only if all submitted edits succeed.
   */
  rollbackOnFailure?: boolean;
}

/**
 * Add features request options.
 *
 * @param url - Feature service url.
 * @param adds - Array of JSON features to add.
 * @param params - Query parameters to be sent to the feature service via the request.
 */
export interface IAddFeaturesRequestOptions
  extends IEditFeaturesParams,
    IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Array of JSON features to add.
   */
  adds: IFeature[];
}

/**
 * Add features results.
 */
export interface IAddFeaturesResult {
  /**
   * Array of JSON response Object(s) for each feature added.
   */
  addResults?: IEditFeatureResult[];
}

/**
 * Add features request.
 *
 * @param requestOptions - Options for the request.
 * ```js
 * import { addFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * addFeatures({
 *   url,
 *   adds: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
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

  appendCustomParams(requestOptions, options);

  // mixin, don't overwrite
  options.params.features = requestOptions.adds;

  return request(url, options);
}

/**
 * Update features request options.
 *
 * @param url - Feature service url.
 * @param updates - Array of JSON features to update.
 * @param params - Query parameters to be sent to the feature service via the request.
 */
export interface IUpdateFeaturesRequestOptions
  extends IEditFeaturesParams,
    IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Array of JSON features to update.
   */
  updates: IFeature[];
}

/**
 * Update features results.
 */
export interface IUpdateFeaturesResult {
  /**
   * Array of JSON response Object(s) for each feature updated.
   */
  updateResults?: IEditFeatureResult[];
}

/**
 * Update features request.
 *
 * ```js
 * import { updateFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * updateFeatures({
 *   url,
 *   updates: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
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

  appendCustomParams(requestOptions, options);

  // mixin, don't overwrite
  options.params.features = requestOptions.updates;

  return request(url, options);
}

/**
 * Delete features parameters.
 */
export interface IDeleteFeaturesParams
  extends IEditFeaturesParams,
    ISharedQueryParams {}

/**
 * Delete features request options.
 *
 * @param url - Feature service url.
 * @param deletes - Array of objectIds to delete.
 * @param params - Query parameters to be sent to the feature service via the request.
 */
export interface IDeleteFeaturesRequestOptions
  extends IDeleteFeaturesParams,
    IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Array of objectIds to delete.
   */
  deletes: number[];
}

/**
 * Delete features results.
 */
export interface IDeleteFeaturesResult {
  /**
   * Array of JSON response Object(s) for each feature deleted.
   */
  deleteResults?: IEditFeatureResult[];
}

/**
 * Delete features request.
 *
 * ```js
 * import { deleteFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * deleteFeatures({
 *   url,
 *   deletes: [1,2,3]
 * });
 * ```
 *
 * @param deleteFeaturesRequestOptions - Options for the request.
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

  appendCustomParams(requestOptions, options);

  // mixin, don't overwrite
  options.params.objectIds = requestOptions.deletes;

  return request(url, options);
}

function appendCustomParams(
  oldOptions: IQueryFeaturesRequestOptions,
  newOptions: IRequestOptions
) {
  // only pass query parameters through in the request, not generic IRequestOptions props
  Object.keys(oldOptions).forEach(function(key: string, index: number) {
    if (
      key !== "url" &&
      key !== "params" &&
      key !== "authentication" &&
      key !== "httpMethod" &&
      key !== "fetch" &&
      key !== "portal" &&
      key !== "maxUrlLength"
    ) {
      newOptions.params[key] = oldOptions[key];
    }
  });
}
