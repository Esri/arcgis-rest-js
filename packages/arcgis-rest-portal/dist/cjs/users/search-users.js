"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = void 0;
const generic_search_js_1 = require("../util/generic-search.js");
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
function searchUsers(search) {
    return (0, generic_search_js_1.genericSearch)(search, "user");
}
exports.searchUsers = searchUsers;
//# sourceMappingURL=search-users.js.map