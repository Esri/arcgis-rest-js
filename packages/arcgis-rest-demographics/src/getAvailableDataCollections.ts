/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import { ARCGIS_ONLINE_GEOENRICHMENT_URL, IEndpointOptions } from "./helpers";

export interface IGetAvailableDataCollectionsOptions extends IEndpointOptions {
  /**
   * Optional parameter to specify an array of string values that describe what derivative variables to include in the output.
   */
  addDerivativeVariables?: string[];
  /**
   * Optional parameter to return only values that are not NULL in the output response.
   */
  suppressNullValues?: boolean;
  /**
   * View a description for a single data collection within a given country. If not specified, will return a list of data collections that can be run in any country.
   */
  countryCode?: string;
  dataCollection?: string;
}


export interface IGetAvailableDataCollectionsResponse {
  DataCollections?: (IDataCollection)[] | null;
}
export interface IDataCollection {
  dataCollectionID: string;
  metadata: IMetadata;
  data?: (IDataInfo)[] | null;
}
export interface IMetadata {
  title: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  url: string;
  keywords: string;
  creationDate: number;
  lastRevisionDate: number;
  webmap: string;
  author: string;
  countries?: string | null;
  IsRoyalties: boolean;
  categories?: ICategory[] | null;
  filters?: (IFilter)[] | null;
  datasets?: string | null;
  hierarchies: string;
  coverage?: string | null;
  mobileinfographics?: string | null;
  icon?: string | null;
}
export interface ICategory {
  id: string;
  name: string;
  alias: string;
  description: string;
  displayOrder: string;
}
export interface IFilter {
  id: string;
  name: string;
  aliasname: string;
  type: string;
  rangeMax?: string | null;
  rangeMin?: string | null;
  enumValues?: string | null;
}
export interface IDataInfo {
  id: string;
  alias: string;
  type: string;
  precision: number;
  length?: null;
  averageBase?: null;
  averageBaseAlias?: null;
  description: string;
  fieldCategory: string;
  indexBase?: number | null;
  percentBase?: string | null;
  percentBaseAlias?: string | null;
  popularity?: number | null;
  units: string;
  vintage?: string | null;
  hideInDataBrowser: boolean;
  filteringTags?: IFilteringTag[] | null;
  derivative: boolean;
  provider: string;
  indexType?: string | null;
}
export interface IFilteringTag {
  id: string;
  name: string;
  value: string;
}


/**
 * ```js
 * import { getAvailableDataCollections } from '@esri/arcgis-rest-demographics';
 * //
 * getAvailableDataCollections()
 *   .then((response) => {
 *     response; // => { DataCollections: [ ... ]  }
 *   });
 * //
 * getAvailableDataCollections({
 *   countryCode: "se",
 *   dataCollection: "EducationalAttainment"
 * })
 *   .then((response) => {
 *     response.; // => { DataCollections: [ ... ] }
 *   });
 * ```
 * Used to determine the data collections available for usage with the Geoenrichment service. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/data-collections.htm) for more information.
 * @param requestOptions Options to pass through to the geoenrichment service.
 * @returns A Promise that will resolve with data collections for the request.
 */
export function getAvailableDataCollections(
  requestOptions?: IGetAvailableDataCollectionsOptions
): Promise<IGetAvailableDataCollectionsResponse> {
  let options: IGetAvailableDataCollectionsOptions = {};
  let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/dataCollections`;
  

  if (!requestOptions) {
    options.params = {};
  } else {
    if (requestOptions.endpoint) {
      endpoint = `${requestOptions.endpoint}/dataCollections`;
    }
    options = appendCustomParams<IGetAvailableDataCollectionsOptions>(
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
