/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroup } from "@esri/arcgis-rest-request";
import { IItem } from "../helpers.js";
import { SearchQueryBuilder } from "../util/SearchQueryBuilder.js";
import {
  ISearchOptions,
  ISearchGroupContentOptions,
  ISearchResult
} from "../util/search.js";
import { genericSearch } from "../util/generic-search.js";

/**
 * Search a portal for groups. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-search.htm) for more information.
 *
 * ```js
 * import { searchGroups } from "@esri/arcgis-rest-portal";
 *
 * searchGroups('water')
 *   .then(response) // response.total => 355
 * ```
 *
 * @param search - A string or RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchGroups(
  search: string | ISearchOptions | SearchQueryBuilder
): Promise<ISearchResult<IGroup>> {
  return genericSearch<IGroup>(search, "group");
}

/**
 * Search a portal for items in a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-content-search.htm) for more information.
 *
 * ```js
 * import { searchGroupContent } from "@esri/arcgis-rest-portal";
 *
 * searchGroupContent('water')
 *   .then(response) // response.total => 355
 * ```
 *
 * @param options - RequestOptions object amended with search parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchGroupContent(
  options: ISearchGroupContentOptions
): Promise<ISearchResult<IItem>> {
  return genericSearch<IItem>(options, "groupContent");
}
