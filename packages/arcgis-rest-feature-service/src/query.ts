/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  ISpatialReference,
  IFeatureSet,
  IFeature,
  Units,
  IExtent,
  ArcGISRequestError,
  ArcGISAuthError,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import {
  IGetLayerOptions,
  ISharedQueryOptions,
  IStatisticDefinition
} from "./helpers.js";
import { pbfToGeoJSON } from "./pbf/pbfToGeoJSON.js";
import { geojsonToArcGIS } from "@terraformer/arcgis";

/**
 * Request options to fetch a feature by id.
 */
export interface IGetFeatureOptions extends IGetLayerOptions {
  /**
   * Unique identifier of the feature.
   */
  id: number;
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
  f?: "json" | "geojson" | "pbf" | "pbf-as-geojson" | "pbf-as-arcgis";
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

/**
 * query all features request options. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 */
export interface IQueryAllFeaturesOptions extends ISharedQueryOptions {
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
  resultType?: "none" | "standard" | "tile";
  // to do: convert from Date() to epoch time internally
  historicMoment?: number;
  returnTrueCurves?: false;
  sqlFormat?: "none" | "standard" | "native";
  returnExceededLimitFeatures?: true;
  /**
   * Response format. Defaults to "json"
   * NOTE: for "pbf" you must also supply `rawResponse: true`
   * and parse the response yourself using `response.arrayBuffer()`
   */
  f?: "json" | "geojson" | "pbf" | "pbf-as-geojson" | "pbf-as-arcgis";
  /**
   * someday...
   *
   * If 'true' the query will be preceded by a metadata check to gather info about coded value domains and result values will be decoded. If a fieldset is provided it will be used to decode values and no internal metadata request will be issued.
   */
  // decodeValues?: boolean | IField[];
}

export interface IQueryAllFeaturesResponse extends IFeatureSet {
  exceededTransferLimit?: true;
}

export interface IQueryResponse {
  count?: number;
  extent?: IExtent;
  objectIdFieldName?: string;
  objectIds?: number[];
}

export function queryPbfAsGeoJSONOrArcGIS(
  url: string,
  queryOptions: IRequestOptions
): Promise<IQueryFeaturesResponse | IQueryAllFeaturesResponse> {
  // need to send rawResponse: true and f=pbf on behalf of the user to fetch the pbf response with metadata
  const customOptions = {
    ...queryOptions,
    params: { ...queryOptions.params, f: "pbf" } as any,
    rawResponse: true
  };
  return request(`${cleanUrl(url)}/query`, customOptions).then(
    async (response: any) => {
      if (response.headers.get("content-type")?.includes("application/json")) {
        const err = (await response.json()).error;
        // throw auth error, else throw request error?
        if (err?.code === 498 || err?.code === 499) {
          throw new ArcGISAuthError(
            err.message,
            err.code,
            err,
            url,
            customOptions
          );
        }
        throw new ArcGISRequestError(
          err.message,
          err.code,
          err,
          url,
          customOptions
        );
      }
      try {
        const arrayBuffer = await response.arrayBuffer();
        const decoded = pbfToGeoJSON(arrayBuffer);
        // return simple decoded geojson feature collection https://geojson.org/
        // TODO: check if this is slightly different than the arcgis geojson object that comes from a geojson request.

        const data =
          queryOptions.params.f === "pbf-as-geojson"
            ? decoded.featureCollection
            : { features: geojsonToArcGIS(decoded.featureCollection) };
        const responseObject:
          | IQueryFeaturesResponse
          | IQueryAllFeaturesResponse = {
          ...data,
          exceededTransferLimit: decoded.exceededTransferLimit
        };
        return responseObject;
      } catch (error) {
        throw new ArcGISRequestError(
          "Error decoding PBF response",
          500,
          error as Error,
          url,
          customOptions
        );
      }
    }
  );
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
 * Query a feature service. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 *
 * ```js
 * import { queryFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * queryFeatures({
 *   url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
 *   where: "STATE_NAME = 'Alaska'"
 * })
 *   .then(result)
 * ```
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

  // three cases:
  // 1. f=pbf: return undecoded pbf straight back to user -- pass over to return
  // 2. f=pbf-as-geojson: decode pbf and return geojson
  // 3. f=pbf-as-arcgis: decode pbf and return arcgis objects
  if (
    queryOptions.params?.f === "pbf-as-geojson" ||
    queryOptions.params?.f === "pbf-as-arcgis"
  ) {
    return queryPbfAsGeoJSONOrArcGIS(requestOptions.url, queryOptions);
  }

  return request(`${cleanUrl(requestOptions.url)}/query`, queryOptions);
}

/**
 * Query a feature service to retrieve all features. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 *
 * ```js
 * import { queryAllFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * queryAllFeatures({
 *   url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
 *   where: "STATE_NAME = 'Alaska'"
 * })
 *   .then(result)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the query response.
 */
export async function queryAllFeatures(
  requestOptions: IQueryAllFeaturesOptions
): Promise<IQueryAllFeaturesResponse> {
  let offset = 0;
  let hasMore = true;
  let allFeaturesResponse: IQueryAllFeaturesResponse | null = null;
  // retrieve the maxRecordCount for the service

  const pageSizeResponse = await request(requestOptions.url, {
    httpMethod: "GET"
  });
  // default the pageSize to 2000 if it is not provided
  const pageSize = pageSizeResponse.maxRecordCount || 2000;
  const userRecordCount = requestOptions.params?.resultRecordCount;
  // use the user defined count only if it's less than or equal to the page size, otherwise use pageSize
  const recordCountToUse =
    userRecordCount && userRecordCount <= pageSize ? userRecordCount : pageSize;

  while (hasMore) {
    const pagedOptions = {
      ...requestOptions,
      params: {
        where: "1=1",
        outFields: "*",
        ...(requestOptions.params || {}),
        resultOffset: offset,
        resultRecordCount: recordCountToUse
      }
    };

    const queryOptions = appendCustomParams<IQueryAllFeaturesOptions>(
      pagedOptions,
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
        "orderByFields",
        "groupByFieldsForStatistics",
        "outStatistics",
        "returnZ",
        "returnM",
        "multipatchOption",
        "resultOffset",
        "resultRecordCount",
        "quantizationParameters",
        "resultType",
        "historicMoment",
        "returnTrueCurves",
        "sqlFormat",
        "f"
      ],
      {
        httpMethod: "GET",
        params: {
          where: "1=1",
          outFields: "*",
          returnExceededLimitFeatures: true,
          ...pagedOptions.params
        }
      }
    );

    let response: IQueryAllFeaturesResponse;
    // for queryAllFeatures we only need to supportpbf-as-geojson and pbf-as-arcgis since we need to decode to know if we need to get all the features
    if (
      queryOptions.params?.f === "pbf-as-geojson" ||
      queryOptions.params?.f === "pbf-as-arcgis"
    ) {
      response = (await queryPbfAsGeoJSONOrArcGIS(
        requestOptions.url,
        queryOptions
      )) as IQueryAllFeaturesResponse;
    } else {
      response = await request(
        `${cleanUrl(requestOptions.url)}/query`,
        queryOptions
      );
    }

    // save the first response structure
    if (!allFeaturesResponse) {
      allFeaturesResponse = { ...response };
    } else {
      // append features of subsequent requests
      allFeaturesResponse.features = allFeaturesResponse.features.concat(
        response.features
      );
    }

    const returnedCount = response.features.length;

    // check if the response has exceededTransferLimit handles both the standard json and geojson responses
    const exceededTransferLimit =
      response.exceededTransferLimit ||
      (response as any).properties?.exceededTransferLimit;

    // check if there are more features
    if (returnedCount < pageSize || !exceededTransferLimit) {
      hasMore = false;
    } else {
      offset += pageSize;
    }
  }
  return allFeaturesResponse;
}
