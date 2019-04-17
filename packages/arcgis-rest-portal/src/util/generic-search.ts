/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import { SearchQueryBuilder } from "./SearchQueryBuilder";
import { getPortalUrl } from "../util/get-portal-url";
import { ISearchRequestOptions, ISearchResult } from "../util/search";

export function genericSearch(
  search: string | ISearchRequestOptions | SearchQueryBuilder,
  searchType: "item" | "group"
): Promise<ISearchResult> {
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

  searchType === "item"
    ? (url = `${getPortalUrl(options)}/search`)
    : (url = `${getPortalUrl(options)}/community/groups`);

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

        return genericSearch(newOptions, searchType);
      };
    }

    return r;
  });
}
