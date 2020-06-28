/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IAuthenticatedRequestOptions } from "@esri/arcgis-rest-auth";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { IPagingParams, IUser } from "@esri/arcgis-rest-types";
import { SearchQueryBuilder } from "../util/SearchQueryBuilder";
import { ISearchOptions, ISearchResult } from "../util/search";
import { genericSearch } from "../util/generic-search";

// export interface IUserSearchOptions extends IAuthenticatedRequestOptions, IPagingParams {
//   q: string | SearchQueryBuilder;
//   sortField?: string;
//   sortOrder?: string;
//   [key: string]: any;
// }

export interface IUserSearchOptions extends ISearchOptions {
  authentication: IAuthenticationManager;
}

/**
 * ```js
 * import { searchItems } from "@esri/arcgis-rest-portal";
 * //
 * searchUsers({ q: 'tommy', authentication })
 *   .then(response) // response.total => 355
 * ```
 * Search a portal for users.
 *
 * @param search - A RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchUsers(
  search: IUserSearchOptions | SearchQueryBuilder
): Promise<ISearchResult<IUser>> {
  return genericSearch<IUser>(search, "user");
}
