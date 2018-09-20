/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IPagingParams, IGroup } from "@esri/arcgis-rest-common-types";

export interface IGroupSearchRequest extends IPagingParams {
  q: string;
  sortField?: string;
  sortOrder?: string;
  [key: string]: any;
}

export interface IGroupSearchResult {
  /**
   * Matches the REST APIs form param
   */
  query: string;
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: IGroup[];
}

/**
 * Search for groups via the portal api
 *
 * ```js
 * import { searchGroups } from '@esri/arcgis-rest-groups';
 *
 * searchgroups({q:'water'})
 * .then((results) => {
 *  console.log(response.results.total); // 355
 * })
 * ```
 *
 * @param searchForm - Search request
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchGroups(
  searchForm: IGroupSearchRequest,
  requestOptions?: IRequestOptions
): Promise<IGroupSearchResult> {
  // construct the search url
  const url = `${getPortalUrl(requestOptions)}/community/groups`;

  // default to a GET
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };

  options.params = { ...searchForm };

  // send the request
  return request(url, options);
}
