import { IAuthenticationManager, IUser } from "@esri/arcgis-rest-request";
import { SearchQueryBuilder } from "../util/SearchQueryBuilder.js";
import { ISearchOptions, ISearchResult } from "../util/search.js";
export interface IUserSearchOptions extends ISearchOptions {
    authentication: IAuthenticationManager;
}
/**
 * Search a portal for users.
 *
 * ```js
 * import { searchItems } from "@esri/arcgis-rest-portal";
 * //
 * searchUsers({ q: 'tommy', authentication })
 *   .then(response) // response.total => 355
 * ```
 *
 * @param search - A RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function searchUsers(search: IUserSearchOptions | SearchQueryBuilder): Promise<ISearchResult<IUser>>;
