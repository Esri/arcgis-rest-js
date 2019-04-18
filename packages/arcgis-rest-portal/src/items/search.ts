/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "@esri/arcgis-rest-types";
import { SearchQueryBuilder } from "../util/SearchQueryBuilder";
import { ISearchRequestOptions, ISearchResult } from "../util/search";
import { genericSearch } from "../util/generic-search";

/**
 * ```js
 * import { searchItems } from "@esri/arcgis-rest-portal";
 * //
 * searchItems('water')
 *   .then(response) // response.total => 355
 * ```
 * Search a portal for items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/search.htm) for more information.
 *
 * @param search - A string or RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchItems(
  search: string | ISearchRequestOptions | SearchQueryBuilder
): Promise<ISearchResult<IItem>> {
  return genericSearch<IItem>(search, "item");
}
