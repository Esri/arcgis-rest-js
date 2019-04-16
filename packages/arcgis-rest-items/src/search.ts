/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";
import { appendCustomParams } from "@esri/arcgis-rest-common";
import { IPagingParams, IItem, ISearch } from "@esri/arcgis-rest-common-types";
import { SearchQueryBuilder } from "./SearchQueryBuilder";

export interface ISearchRequestOptions extends IRequestOptions, IPagingParams {
  q: string | SearchQueryBuilder;
  sortField?: string;
  sortDir?: string;
  [key: string]: any;
}

/**
 * Options to pass through when searching for items.
 */
export interface ISearchResult {
  query: string; // matches the api's form param
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: IItem[];
  nextPage?: () => Promise<ISearchResult>;
}

/**
 * ```js
 * import { searchItems } from '@esri/arcgis-rest-items';
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
): Promise<ISearchResult> {
  let options: IRequestOptions;
  if (typeof search === "string" || search instanceof SearchQueryBuilder) {
    options = {
      httpMethod: "GET",
      params: {
        q: search
      }
    };
  } else {
    options = appendCustomParams<ISearchRequestOptions>(
      search,
      ["q", "num", "start", "sortField", "sortDir"],
      {
        httpMethod: "GET"
      }
    );
  }

  // construct the search url
  const url = `${getPortalUrl(options)}/search`;

  // send the request
  return request(url, options).then(r => {
    if (r.nextStart && r.nextStart !== -1) {
      r.nextPage = function() {
        let newOptions: ISearchRequestOptions;

        if (
          typeof search === "string" ||
          search instanceof SearchQueryBuilder
        ) {
          newOptions = {
            q: search,
            start: r.nextStart
          };
        } else {
          newOptions = search;
          newOptions.start = r.nextStart;
        }

        return searchItems(newOptions);
      };
    }

    return r;
  });
}
