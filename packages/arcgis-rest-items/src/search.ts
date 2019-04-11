/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IPagingParams, IItem } from "@esri/arcgis-rest-common-types";
import { SearchQueryBuilder } from "./SearchBuilder";

// this interface still needs to be docced
export interface ISearchRequest extends IPagingParams {
  q: string | SearchQueryBuilder;
  [key: string]: any;
}

export interface ISearchRequestOptions extends IRequestOptions {
  searchForm?: ISearchRequest;
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
  nextPage?: () => Promise<ISearchRequest>;
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
  let options: ISearchRequestOptions = {
    httpMethod: "GET",
    params: {}
  };

  if (typeof search === "string" || search instanceof SearchQueryBuilder) {
    options.params.q = search;
  } else {
    // mixin user supplied requestOptions with defaults
    options = {
      ...options,
      ...search
    };

    // mixin arbitrary request parameters with search form
    options.params = {
      ...search.params,
      ...search.searchForm
    };
  }

  // construct the search url
  const url = `${getPortalUrl(options)}/search`;

  // send the request
  return request(url, options).then(r => {
    if (options.rawResponse) {
      return r;
    }

    if (r.nextStart === -1) {
      r.nextPage = function() {
        const newOptions = {
          ...options,
          ...{
            params: {
              ...options.params,
              ...{ start: r.nextStart }
            }
          }
        };
        return request(url, newOptions);
      };
    }

    return r;
  });
}
