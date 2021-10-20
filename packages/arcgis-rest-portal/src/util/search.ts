/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, IGroup, IUser } from "@esri/arcgis-rest-request";
import { IItem , IPagingParams } from "../helpers.js";
import { SearchQueryBuilder } from "./SearchQueryBuilder.js";


export interface ISearchOptions extends IRequestOptions, IPagingParams {
  /** The query string to search against. */
  q: string | SearchQueryBuilder;

  /** Field to sort by. */
  sortField?: string;

  /** Describes whether order returns in ascending or descending order. The default is ascending. */
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

export interface ISearchGroupContentOptions extends ISearchOptions {
  groupId: string;
}

/**
 * Results from an item or group search.
 */
export interface ISearchResult<T extends IItem | IGroup | IUser> {
  query: string; // matches the api's form param
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: T[];
  nextPage?: () => Promise<ISearchResult<T>>;
  /**
   * Aggregations will only be present on item searches when [`fieldCounts`](https://developers.arcgis.com/rest/users-groups-and-items/search.htm#GUID-1C625F8A-4A12-45BB-B537-74C82315759A) are requested.
   */
  aggregations?: {
    counts: Array<{
      fieldName: string;
      fieldValues: Array<{
        value: any;
        count: number;
      }>;
    }>;
  };
}
