/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
} from "@esri/arcgis-rest-request";
import { IFeatureSet } from "@esri/arcgis-rest-types";

import {
  ARCGIS_ONLINE_GEOENRICHMENT_URL,
  IGeoenrichmentResult,
  IEndpointOptions,
} from "./helpers";

export interface IQueryDemographicDataOptions extends IEndpointOptions {
  /**
   * Defines the area on a map which is being analyzed
   */
  studyAreas: any[];
  /**
   * A Data Collection is a preassembled list of attributes that will be used to enrich the input features. Enrichment attributes can describe various types of information such as demographic characteristics and geographic context of the locations or areas submitted as input features in studyAreas.
   */
  dataCollections?: string[];
  /**
   * Specify a subset of variables to be returned from one or more Data Collections
   */
  analysisVariables?: string[];
  /**
   * Specify an array of string values that describe what derivative variables to include in the output
   */
  addDerivativeVariables?: boolean;
  /**
   * Request the output geometries in the response
   */
  returnGeometry?: boolean;
  /**
   * Define the input geometries in the studyAreas parameter in a specified spatial reference system
   */
  inSR?: number;
  /**
   * Request the output geometries in a specified spatial reference system
   */
  outSR?: number;
}

export interface IQueryDemographicDataResponse {
  results: IGeoenrichmentResult[] | null;
  messages: string[] | null;
}

/**
 * ```js
 * import { queryDemographicData } from '@esri/arcgis-rest-demographics';
 * //
 * queryDemographicData({
 *  studyAreas: [{"geometry":{"x":-117.1956,"y":34.0572}}],
 *  authentication
 * })
 *   .then((response) => {
 *     response; // => { results: [ ... ] }
 *   });
 * ```
 * Used to get facts about a location or area. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/enrich.htm) for more information.
 * @param requestOptions Options to pass through to the service.
 * @returns A Promise that will resolve with results for the request.
 */
export function queryDemographicData(
  requestOptions?: IQueryDemographicDataOptions
): Promise<IQueryDemographicDataResponse> {
  const options = appendCustomParams<IQueryDemographicDataOptions>(
    requestOptions,
    [
      "studyAreas",
      "dataCollections",
      "analysisVariables",
      "addDerivativeVariables",
      "returnGeometry",
      "inSR",
      "outSR",
    ],
    { params: { ...requestOptions.params } }
  );

  // the SAAS service does not support anonymous requests
  if (!requestOptions.authentication) {
    return Promise.reject(
      "Geoenrichment using the ArcGIS service requires authentication"
    );
  }

  // These parameters are passed as JSON-style strings:
  ["dataCollections", "analysisVariables"].forEach((parameter) => {
    if (options.params[parameter]) {
      options.params[parameter] = JSON.stringify(options.params[parameter]);
    }
  });

  // add spatialReference property to individual matches
  return request(
    `${cleanUrl(
      `${requestOptions.endpoint || ARCGIS_ONLINE_GEOENRICHMENT_URL}/enrich`
    )}`,
    options
  ).then((response: any) => {
    return response;
  });
}
