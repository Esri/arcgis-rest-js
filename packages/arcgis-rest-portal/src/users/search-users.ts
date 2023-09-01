/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IAuthenticationManager, IUser } from "@esri/arcgis-rest-request";
import { SearchQueryBuilder } from "../util/SearchQueryBuilder.js";
import { ISearchOptions, ISearchResult } from "../util/search.js";
import { genericSearch } from "../util/generic-search.js";

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
 * Search a portal for users.
 *
 * ```js
 * import { searchUsers } from "@esri/arcgis-rest-portal";
 * //
 * searchUsers({ q: 'tommy', authentication })
 *   .then(response) // response.total => 355
 * ```
 *
 * @param search - A RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchUsers(
  search: IUserSearchOptions | SearchQueryBuilder
): Promise<ISearchResult<IUser>> {
  return genericSearch<IUser>(search, "user");
}

/**
 * ```js
 * import { searchCommunityUsers } from "@esri/arcgis-rest-portal";
 * //
 * searchCommunityUsers({ q: 'tommy', authentication })
 *   .then(response) // response.total => 355
 * ```
 * Search all portals for users.
 *
 * @param search - A RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchCommunityUsers(
  search: IUserSearchOptions | SearchQueryBuilder
): Promise<ISearchResult<IUser>> {
  return genericSearch<IUser>(search, "communityUser");
}
