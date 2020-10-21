/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";
import { IFeatureSet } from "@esri/arcgis-rest-types";

import { ARCGIS_ONLINE_GEOENRICHMENT_URL, IGeoenrichmentResult } from "./helpers";

export interface IQueryDemographicDataOptions extends IRequestOptions {
  studyAreas: any[];
  dataCollections?: string[];
  analysisVariables?: string[];
  addDerivativeVariables?: boolean;
  returnGeometry?: boolean;
  inSR?: number;
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
  if (
    !requestOptions.authentication
  ) {
    return Promise.reject(
      "Geoenrichment using the ArcGIS service requires authentication"
    );
  }

  if (options.params.dataCollections) {
    options.params.dataCollections = JSON.stringify(options.params.dataCollections);
  }
  if (options.params.analysisVariables) {
    options.params.analysisVariables = JSON.stringify(options.params.analysisVariables);
  }

  // add spatialReference property to individual matches
  return request(`${cleanUrl(`${ARCGIS_ONLINE_GEOENRICHMENT_URL}/enrich`)}`, options).then(
    (response: any) => {
      return response;
    }
  );
}
