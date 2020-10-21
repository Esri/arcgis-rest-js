/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL, IGeoenrichmentResult } from "./helpers";

export interface IGetGeographyOptions extends IRequestOptions {
  /**
   * Specify the source country for the search.
   */
  sourceCountry?: string;
  /**
   * Specify a specific dataset within a defined country.
   */
  optionalCountryDataset?: string;
  /**
   * Specify which standard geography layers are being queried or searched.
   */
  geographyLayers?: string[] | string;
  /**
   * Specify which IDs for the standard geography layers are being queried or searched.
   */
  geographyIDs?: string[];
  /**
   * Specify the text to query and search the standard geography layers specified.
   */
  geographyQuery?: string;
  /**
   * Return all the subgeographic areas that are within a parent geography.
   */
  returnSubGeographyLayer?: boolean;
  /**
   * Return all the subgeographic areas that are within a parent geography.
   */
  subGeographyLayer?: string;
  /**
   * Filter the results of the subgeography features that are returned by a search term.
   */
  subGeographyQuery?: string;
  /**
   * Request the output geometries in a specified spatial reference system.
   */
  outSR?: number;
  /**
   * Request the output geometries in the response.
   */
  returnGeometry?: boolean;
  /**
   * Request the output geometry to return the center point for each feature.
   */
  returnCentroids?: boolean;
  /**
   * Integer that specifies the level of generalization or detail in the area representations of the administrative boundary or standard geographic data layers.
   */
  generalizationLevel?: number;
  /**
   * Define if text provided in the geographyQuery parameter should utilize fuzzy search logic.
   */
  useFuzzySearch?: boolean;
  /**
   * Limits the number of features that are returned from the geographyQuery parameter.
   */
  featureLimit?: number;
  /**
   * Starts the results on the number of the records specified.
   */
  featureOffset?: number;
  /**
   * Specifies the language you wish to receive your GeoEnrichment results.
   */
  langCode?: string;
}


export interface IGetGeographyResponse {
  results: IGeoenrichmentResult[] | null;
  messages: string[] | null;
}

/**
 * ```js
 * import { getGeography } from '@esri/arcgis-rest-demographics';
 * //
 * getGeography({
 *   sourceCountry: "CA",
 *   geographyIDs: ["35"]
 * })
 *   .then((response) => {
 *     response.; // => { results: [ ... ] }
 *   });
 * ```
 * Used to get standard geography IDs and features for the supported geographic levels. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-query.htm) for more information.
 * @param requestOptions Options to pass through to the service. All properties are optional, but either `geographyIds` or `geographyQuery` must be sent at a minimum.
 * @returns A Promise that will resolve with return data defined and optionally geometry for the feature.
 */
export function getGeography(
  requestOptions?: IGetGeographyOptions
): Promise<IGetGeographyResponse> {
  const options = appendCustomParams<IGetGeographyOptions>(
    requestOptions,
    [
      "sourceCountry",
      "optionalCountryDataset",
      "geographyLayers",
      "geographyIDs",
      "geographyQuery",
      "returnSubGeographyLayer",
      "subGeographyLayer",
      "subGeographyQuery",
      "outSR",
      "returnGeometry",
      "returnCentroids",
      "generalizationLevel",
      "useFuzzySearch",
      "featureLimit",
      "featureOffset",
      "langCode",
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

  // These parameters are passed as JSON style strings:
  ["geographyLayers", "geographyIDs"].forEach((parameter) => {
    if (options.params[parameter]) {
      options.params[parameter] = JSON.stringify(options.params[parameter]);
    }
  });
  

  // add spatialReference property to individual matches
  return request(`${cleanUrl(`${ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL}/execute`)}`, options).then(
    (response: any) => {
      return response;
    }
  );
}
