/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { ARCGIS_ONLINE_GEOENRICHMENT_URL, IGeoenrichmentResult } from "./helpers";

export interface IGetGeographyOptions extends IRequestOptions {
  /**
   * Optional parameter to specify the source country for the search.
   */
  sourceCountry?: string;
  /**
   * Optional parameter to specify a specific dataset within a defined country.
   */
  optionalCountryDataset?: string;
  /**
   * Optional parameter to specify which standard geography layers are being queried or searched.
   */
  geographyLayers?: string[] | string;
  /**
   * Optional parameter to specify which IDs for the standard geography layers are being queried or searched.
   */
  geographyIDs?: string[];
  /**
   * Optional parameter to specify the text to query and search the standard geography layers specified.
   */
  geographyQuery?: string;
  /**
   * Optional parameter to return all the subgeographic areas that are within a parent geography.
   */
  returnSubGeographyLayer?: boolean;
  /**
   * Optional parameter to return all the subgeographic areas that are within a parent geography.
   */
  subGeographyLayer?: string;
  /**
   * Optional parameter to filter the results of the subgeography features that are returned by a search term.
   */
  subGeographyQuery?: string;
  /**
   * Optional parameter to request the output geometries in a specified spatial reference system.
   */
  outSR?: number;
  /**
   * Optional parameter to request the output geometries in the response.
   */
  returnGeometry?: boolean;
  /**
   * Optional parameter to request the output geometry to return the center point for each feature.
   */
  returnCentroids?: boolean;
  /**
   * Optional integer that specifies the level of generalization or detail in the area representations of the administrative boundary or standard geographic data layers.
   */
  generalizationLevel?: number;
  /**
   * Optional parameter to define if text provided in the geographyQuery parameter should utilize fuzzy search logic.
   */
  useFuzzySearch?: boolean;
  /**
   * Optional parameter that limits the number of features that are returned from the geographyQuery parameter.
   */
  featureLimit?: number;
  /**
   * Optional parameter that starts the results on the number of the records specified.
   */
  featureOffset?: number;
  /**
   * Optional parameter that specifies the language you wish to receive your GeoEnrichment results.
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
 * getGeography()
 *   .then((response) => {
 *     response; // => { results: [ ... ]  }
 *   });
 * //
 * getGeography({
 *   countryCode: "se",
 *   dataCollection: "EducationalAttainment"
 * })
 *   .then((response) => {
 *     response.; // => { results: [ ... ] }
 *   });
 * ```
 * Used to determine the data collections available for usage with the Geoenrichment service. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-query.htm) for more information.
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with data collections for the request.
 */
export function getGeography(
  requestOptions?: IGetGeographyOptions
): Promise<IGetDataCollectionsResponse> {
  let options: IGetGeographyOptions = {};
  let endpoint: string = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/dataCollections`;
  

  if (!requestOptions) {
    options.params = {};
  } else {
    options = appendCustomParams<IGetGeographyOptions>(
      requestOptions,
      [
        "addDerivativeVariables",
        "suppressNullValues",
      ],
      { params: { ...requestOptions.params } }
    );

    if (options.params.addDerivativeVariables) {
      options.params.addDerivativeVariables = JSON.stringify(options.params.addDerivativeVariables);
    }

    if(requestOptions.countryCode) {
      endpoint = `${endpoint}/${requestOptions.countryCode}`;
      if(requestOptions.dataCollection) {
        endpoint = `${endpoint}/${requestOptions.dataCollection}`;
      }
    }
  }

  

  // add spatialReference property to individual matches
  return request(`${cleanUrl(endpoint)}`, options).then(
    (response: any) => {
      return response;
    }
  );
}
