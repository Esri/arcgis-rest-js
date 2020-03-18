/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  appendCustomParams
} from "@esri/arcgis-rest-request";
import { IItem, IGroup, IUser } from "@esri/arcgis-rest-types";

import { SearchQueryBuilder } from "./SearchQueryBuilder";
import { getPortalUrl } from "../util/get-portal-url";
import { ISearchOptions, ISearchResult } from "../util/search";

export function genericSearch<T extends IItem | IGroup | IUser>(
  search: string | ISearchOptions | SearchQueryBuilder,
  searchType: "item" | "group" | "user"
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
    options = appendCustomParams<ISearchOptions>(
      search,
      ["q", "num", "start", "sortField", "sortOrder"],
      {
        httpMethod: "GET"
      }
    );
  }

  let path;
  switch (searchType) {
    case "item":
      path = "/search";
      break;
    case "group":
      path = "/community/groups";
      if (
        typeof search !== "string" &&
        !(search instanceof SearchQueryBuilder) &&
        search.groupId
      ) {
        path = `/content/groups/${search.groupId}/search`;
      }
      break;
    default:
      // "users"
      path = "/portals/self/users/search";
      break;
  }
  url = getPortalUrl(options) + path;

  // send the request
  return request(url, options).then(r => {
    if (r.nextStart && r.nextStart !== -1) {
      r.nextPage = function() {
        let newOptions: ISearchOptions;

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
