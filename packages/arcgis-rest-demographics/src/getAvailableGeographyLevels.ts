/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import {
  ARCGIS_ONLINE_GEOENRICHMENT_URL,
  IEndpointOptions
} from "./helpers.js";

export interface IGetAvailableGeographyLevelsResponse {
  messages?: string[] | null;
  childResources?: any[] | null;
  childDatasets?: any[] | null;
  childHierarchies?: any[] | null;
  geographyLevels?: IGeographyLevel[] | null;
}
export interface IGeographyLevel {
  countryID: string;
  countryName: string;
  datasets?: IDataset[] | null;
  hierarchies?: IGeographyLevelHierarchy[] | null;
}
export interface IDataset {
  datasetID: string;
  branches?: IBranch[] | null;
  levels?: ILevel[] | null;
}
export interface IBranch {
  id: string;
  name: string;
  levels?: string[] | null;
}
export interface ILevel {
  id: string;
  name: string;
  isWholeCountry: boolean;
  adminLevel: string;
  singularName: string;
  pluralName: string;
  description?: string | null;
}
export interface IGeographyLevelHierarchy {
  ID: string;
  branches?: IBranch[] | null;
  levels?: ILevel[] | null;
}

/**
 * Returns a list of available geography data layers, which can then be used in [getGeography()](). See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-levels.htm) for more information.
 *
 * ```js
 * import { getAvailableGeographyLevels } from '@esri/arcgis-rest-demographics';
 * //
 * getAvailableGeographyLevels()
 *   .then((response) => {
 *     response; // => { geographyLevels: [ ... ]  }
 *   });
 * ```
 *
 * @param requestOptions Options to pass through to the geoenrichment service.
 * @returns A Promise that will resolve with available geography levels for the request.
 */
export function getAvailableGeographyLevels(
  requestOptions?: IEndpointOptions
): Promise<IGetAvailableGeographyLevelsResponse> {
  let options: IEndpointOptions = {};
  let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/StandardGeographyLevels`;

  if (!requestOptions) {
    options.params = {};
  } else {
    if (requestOptions.endpoint) {
      endpoint = `${requestOptions.endpoint}/StandardGeographyLevels`;
    }
    options = appendCustomParams<IEndpointOptions>(requestOptions, [], {
      params: { ...requestOptions.params }
    });
  }

  return request(`${cleanUrl(endpoint)}`, options).then((response: any) => {
    return response;
  });
}
