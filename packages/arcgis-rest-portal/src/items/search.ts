/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "../helpers.js";
import { SearchQueryBuilder } from "../util/SearchQueryBuilder.js";
import { ISearchOptions, ISearchResult } from "../util/search.js";
import { genericSearch } from "../util/generic-search.js";

/**
 * Search a portal for items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/search.htm) for more information.
 *
 * ```js
 * import { searchItems } from "@esri/arcgis-rest-portal";
 *
 * searchItems('water')
 *   .then(response) // response.total => 355
 * ```
 *
 * @param search - A string or RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchItems(
  search: string | ISearchOptions | SearchQueryBuilder
): Promise<ISearchResult<IItem>> {
  // For the "categories" param, we want to send each entry in the array as
  // a distinct parameter. I.e. categories: ["a", "b,c"] should be sent as
  // ....&categories=a&categories=b,c
  // To get this behavior out of our lower-level request modules, we need to
  // send category as an array of arrays.
  if (
    typeof search === "object" &&
    !(search instanceof SearchQueryBuilder) &&
    search.params?.categories
  ) {
    search.params.categories = search.params.categories.map((x: string) => {
      return x.split(",");
    });
  }

  return genericSearch<IItem>(search, "item");
}
