/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPagingParams, IItem, IGroup } from "@esri/arcgis-rest-types";
import { SearchQueryBuilder } from "./SearchQueryBuilder";

export interface ISearchOptions extends IRequestOptions, IPagingParams {
  q: string | SearchQueryBuilder;
  sortField?: string;
  sortDir?: string;
  [key: string]: any;
}

/**
 * Results from an item or group search.
 */
export interface ISearchResult<T extends IItem | IGroup> {
  query: string; // matches the api's form param
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: T[];
  nextPage?: () => Promise<ISearchResult<T>>;
  aggregations?: { counts: any };
}
