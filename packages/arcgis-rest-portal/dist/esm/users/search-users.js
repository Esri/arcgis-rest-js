import { genericSearch } from "../util/generic-search.js";
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
export function searchUsers(search) {
    return genericSearch(search, "user");
}
//# sourceMappingURL=search-users.js.map