/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  appendCustomParams
} from "@esri/arcgis-rest-request";
import {
  ISpatialReference,
  IFeatureSet,
  IFeature,
  esriUnits,
  IExtent,
  IField,
  ILayerDefinition
} from "@esri/arcgis-rest-common-types";

import { getFeatureService } from "./getFeatureService";
import { ISharedQueryParams } from "./helpers";

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
  // if fields false, skip metadata check, dont massage query response
  // if fields populated, skip metadata check, make cvds and dates readable in response
  // if fields true, fetch metadata and make cvds and dates readable
  // if fields missing, fetch metadata and make cvds and dates readable
  fields?: any;
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
 *   where: "STATE_NAME = 'Alaska'"
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
  if (
    typeof requestOptions.fields === "undefined" ||
    (typeof requestOptions.fields === "boolean" && requestOptions.fields)
  ) {
    // ensure custom fetch and authentication are passed through
    const metadataOptions: IRequestOptions = {
      httpMethod: "GET",
      authentication: requestOptions.authentication || null,
      fetch: requestOptions.fetch || null
    };
    // fetch metadata to retrieve information about coded value domains
    return getFeatureService(requestOptions.url, metadataOptions).then(
      (metadata: ILayerDefinition) => {
        requestOptions.fields = metadata.fields;
        return _queryFeatures(requestOptions);
      }
    );
  } else {
    return _queryFeatures(requestOptions);
  }
}

function _queryFeatures(
  requestOptions: IQueryFeaturesRequestOptions
): Promise<IQueryFeaturesResponse | IQueryResponse> {
  const queryOptions: IQueryFeaturesRequestOptions = {
    params: {},
    httpMethod: "GET",
    url: requestOptions.url,
    fields: false,
    ...requestOptions
  };

  appendCustomParams(requestOptions, queryOptions);

  // set default query parameters
  if (!queryOptions.params.where) {
    queryOptions.params.where = "1=1";
  }
  if (!queryOptions.params.outFields) {
    queryOptions.params.outFields = "*";
  }

  if (!requestOptions.fields) {
    return request(`${queryOptions.url}/query`, queryOptions);
  } else {
    // turn the fields array into a POJO to avoid multiple calls to Array.find()
    const fieldsObject: any = {};
    queryOptions.fields.forEach((field: IField) => {
      fieldsObject[field.name] = field;
    });

    return request(`${queryOptions.url}/query`, queryOptions).then(response => {
      response.features.forEach((feature: IFeature) => {
        for (const key in feature.attributes) {
          if (!feature.attributes.hasOwnProperty(key)) continue;
          feature.attributes[key] = convertAttribute(
            feature.attributes,
            fieldsObject[key]
          );
        }
      });
      return response;
    });
  }
}

/**
 * ripped off from https://github.com/GeoXForm/esri-to-geojson/blob/55d32955d8ef0acb26de70025539e7c7a37d838e/src/index.js#L193-L220
 *
 * Decodes an attributes CVD and standardizes any date fields
 *
 * @params {object} attribute - a single esri feature attribute
 * @params {object} field - the field metadata describing that attribute
 * @returns {object} outAttribute - the converted attribute
 * @private
 */

function convertAttribute(attribute: any, field: IField) {
  const inValue = attribute[field.name];
  let value;

  if (inValue === null) return inValue;

  if (field.domain && field.domain.type === "codedValue") {
    value = cvd(inValue, field);
  } else if (field.type === "esriFieldTypeDate") {
    try {
      value = new Date(inValue).toISOString();
    } catch (e) {
      value = inValue;
    }
  } else {
    value = inValue;
  }
  return value;
}

/**
 * also ripped off from https://github.com/GeoXForm/esri-to-geojson/blob/55d32955d8ef0acb26de70025539e7c7a37d838e/src/index.js#L222-L235
 *
 * Looks up a value from a coded domain
 *
 * @params {integer} value - The original field value
 * @params {object} field - metadata describing the attribute field
 * @returns {string/integerfloat} - The decoded field value
 * @private
 */

function cvd(value: any, field: IField) {
  const domain = field.domain.codedValues.find((d: any) => {
    return value === d.code;
  });
  return domain ? domain.name : value;
}
