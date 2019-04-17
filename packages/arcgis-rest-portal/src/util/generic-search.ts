/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  appendCustomParams,
  IItem,
  IGroup
} from "@esri/arcgis-rest-request";

import { SearchQueryBuilder } from "./SearchQueryBuilder";
import { getPortalUrl } from "../util/get-portal-url";
import { ISearchRequestOptions, ISearchResult } from "../util/search";

export function genericSearch<T extends IItem | IGroup>(
  search: string | ISearchRequestOptions | SearchQueryBuilder,
  searchType: "item" | "group"
): Promise<ISearchResult<T>> {
  let url: string;
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
      ["q", "num", "start", "sortField", "sortDir", "sortOrder"],
      {
        httpMethod: "GET"
      }
    );
  }

  url =
    getPortalUrl(options) +
    (searchType === "item" ? "/search" : "/community/groups");

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

        return genericSearch<T>(newOptions, searchType);
      };
    }

    return r;
  });
}
