/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { ARCGIS_ONLINE_GEOENRICHMENT_URL } from "./helpers";

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
  hierarchies?: IHierarchy[] | null;
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
export interface IHierarchy {
  ID: string;
  branches?: IBranch[] | null;
  levels?: ILevel[] | null;
}


/**
 * ```js
 * import { getAvailableGeographyLevels } from '@esri/arcgis-rest-demographics';
 * //
 * getAvailableGeographyLevels()
 *   .then((response) => {
 *     response; // => { geographyLevels: [ ... ]  }
 *   });
 * ```
 * Returns a list of available geography data layers, which can then be used in [getGeography()](). See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-levels.htm) for more information.
 * @param requestOptions Options to pass through to the geoenrichment service.
 * @returns A Promise that will resolve with available geography levels for the request.
 */
export function getAvailableGeographyLevels(
  requestOptions?: IRequestOptions
): Promise<IGetAvailableGeographyLevelsResponse> {
  let options: IRequestOptions = {};
  const endpoint: string = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/StandardGeographyLevels`;

  if (!requestOptions) {
    options.params = {};
  } else {
    options = appendCustomParams<IRequestOptions>(
      requestOptions,
      [],
      { params: { ...requestOptions.params } }
    );
  }

  return request(`${cleanUrl(endpoint)}`, options).then(
    (response: any) => {
      return response;
    }
  );
}
