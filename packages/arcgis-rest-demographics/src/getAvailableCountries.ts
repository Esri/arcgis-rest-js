/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IExtent
} from "@esri/arcgis-rest-request";

import {
  ARCGIS_ONLINE_GEOENRICHMENT_URL,
  IEndpointOptions
} from "./helpers.js";

export interface IGetAvailableCountriesOptions extends IEndpointOptions {
  /**
   * View a description for a given country. If not specified, will return a list of all countries.
   */
  countryCode?: string;
}

export interface IGetAvailableCountriesResponse {
  messages?: string[];
  countries?: ICountry[];
  childResources?: any[];
}
export interface ICountry {
  id: string;
  name: string;
  abbr3: string;
  altName: string;
  continent: string;
  distanceUnits: string;
  esriUnits: string;
  defaultExtent: IExtent;
  defaultDatasetID: string;
  datasets?: string[];
  hierarchies?: IHierarchy[];
  defaultDataCollection: string;
  dataCollections: string;
  defaultReportTemplate: string;
  currencySymbol: string;
  currencyFormat: string;
}
export interface IHierarchy {
  ID: string;
  alias: string;
  shortDescription: string;
  default: boolean;
  longDescription: string;
  locales?: string[];
  datasets?: string[];
  levelsInfo: ILevelsInfo;
  variablesInfo: IVariablesInfo;
  populationToPolygonSizeRating: number;
  apportionmentConfidence: number;
  apportionmentThresholds?: IApportionmentThreshold[];
  hasMarginOfErrorData?: boolean;
}
export interface ILevelsInfo {
  geographyLevels?: string[];
}
export interface IVariablesInfo {
  categories?: string[];
}
export interface IApportionmentThreshold {
  method: string;
  dataLayer: string;
  pointsLayer?: string;
  maximumSize?: number;
}

/**
 * Return a list of information for all countries. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/countries.htm) for more information.
 *
 * ```js
 * import { getAvailableCountries } from '@esri/arcgis-rest-demographics';
 *
 * getAvailableCountries()
 *   .then((response) => {
 *     response; // => { countries: [ ... ]  }
 *   });
 * ```
 *
 * @param requestOptions Options to pass through to the geoenrichment service.
 * @returns A Promise that will resolve with available geography levels for the request.
 */
export function getAvailableCountries(
  requestOptions?: IGetAvailableCountriesOptions
): Promise<IGetAvailableCountriesResponse> {
  let options: IEndpointOptions = {};
  let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/countries`;
  if (!requestOptions) {
    options.params = {};
  } else {
    if (requestOptions.endpoint) {
      endpoint = `${requestOptions.endpoint}/countries`;
    }

    options = appendCustomParams<IGetAvailableCountriesOptions>(
      requestOptions,
      [],
      { params: { ...requestOptions.params } }
    );
    if (requestOptions.countryCode) {
      endpoint = `${endpoint}/${requestOptions.countryCode}`;
    }
  }

  return request(cleanUrl(endpoint), options).then((response: any) => {
    return response;
  });
}
