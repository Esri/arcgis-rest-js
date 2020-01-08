/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import {
  ISpatialReference,
  IFeatureSet,
  IFeature,
  Units,
  IExtent
} from "@esri/arcgis-rest-types";

import { IGetLayerOptions, ISharedQueryOptions } from "./helpers";

/**
 * Request options to fetch a feature by id.
 */
export interface IGetFeatureOptions extends IGetLayerOptions {
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
export interface IQueryFeaturesOptions extends ISharedQueryOptions {
  objectIds?: number[];
  relationParam?: string;
  // NOTE: either time=1199145600000 or time=1199145600000, 1230768000000
  time?: number | number[];
  distance?: number;
  units?: Units;
  /**
   * Attribute fields to include in the response. Defaults to "*"
   */
  outFields?: "*" | string[];
  returnGeometry?: boolean;
  maxAllowableOffset?: number;
  geometryPrecision?: number;
  // NOTE: either WKID or ISpatialReference
  inSR?: string | ISpatialReference;
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
  /**
   * Response format. Defaults to "json"
   * NOTE: for "pbf" you must also supply `rawResponse: true`
   * and parse the response yourself using `response.arrayBuffer()`
   */
  f?: "json" | "geojson" | "pbf";
  /**
   * someday...
   *
   * If 'true' the query will be preceded by a metadata check to gather info about coded value domains and result values will be decoded. If a fieldset is provided it will be used to decode values and no internal metadata request will be issued.
   */
  // decodeValues?: boolean | IField[];
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
 * ```js
 * import { getFeature } from '@esri/arcgis-rest-feature-layer';
 * //
 * const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
 * //
 * getFeature({
 *   url,
 *   id: 42
 * }).then(feature => {
 *  console.log(feature.attributes.FID); // 42
 * });
 * ```
 * Get a feature by id.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the feature or the [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) itself if `rawResponse: true` was passed in.
 */
export function getFeature(
  requestOptions: IGetFeatureOptions
): Promise<IFeature> {
  const url = `${cleanUrl(requestOptions.url)}/${requestOptions.id}`;

  // default to a GET request
  const options: IGetFeatureOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options).then((response: any) => {
    if (options.rawResponse) {
      return response;
    }
    return response.feature;
  });
}

/**
 * ```js
 * import { queryFeatures } from '@esri/arcgis-rest-feature-layer';
 * //
 * queryFeatures({
 *   url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
 *   where: "STATE_NAME = 'Alaska'"
 * })
 *   .then(result)
 * ```
 * Query a feature service. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the query response.
 */
export function queryFeatures(
  requestOptions: IQueryFeaturesOptions
): Promise<IQueryFeaturesResponse | IQueryResponse> {
  const queryOptions = appendCustomParams<IQueryFeaturesOptions>(
    requestOptions,
    [
      "where",
      "objectIds",
      "relationParam",
      "time",
      "distance",
      "units",
      "outFields",
      "geometry",
      "geometryType",
      "spatialRel",
      "returnGeometry",
      "maxAllowableOffset",
      "geometryPrecision",
      "inSR",
      "outSR",
      "gdbVersion",
      "returnDistinctValues",
      "returnIdsOnly",
      "returnCountOnly",
      "returnExtentOnly",
      "orderByFields",
      "groupByFieldsForStatistics",
      "outStatistics",
      "returnZ",
      "returnM",
      "multipatchOption",
      "resultOffset",
      "resultRecordCount",
      "quantizationParameters",
      "returnCentroid",
      "resultType",
      "historicMoment",
      "returnTrueCurves",
      "sqlFormat",
      "returnExceededLimitFeatures",
      "f"
    ],
    {
      httpMethod: "GET",
      params: {
        // set default query parameters
        where: "1=1",
        outFields: "*",
        ...requestOptions.params
      }
    }
  );

  return request(`${cleanUrl(requestOptions.url)}/query`, queryOptions);
}
