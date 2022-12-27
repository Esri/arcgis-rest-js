"use strict";
/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGroupContent = exports.searchGroups = void 0;
const generic_search_js_1 = require("../util/generic-search.js");
/**
 * Search a portal for groups. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-search.htm) for more information.
 *
 * ```js
 * import { searchGroups } from "@esri/arcgis-rest-portal";
 *
 * searchGroups('water')
 *   .then(response) // response.total => 355
 * ```
 *
 * @param search - A string or RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
function searchGroups(search) {
    return (0, generic_search_js_1.genericSearch)(search, "group");
}
exports.searchGroups = searchGroups;
/**
 * Search a portal for items in a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-content-search.htm) for more information.
 *
 * ```js
 * import { searchGroupContent } from "@esri/arcgis-rest-portal";
 *
 * searchGroupContent('water')
 *   .then(response) // response.total => 355
 * ```
 *
 * @param options - RequestOptions object amended with search parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
function searchGroupContent(options) {
    return (0, generic_search_js_1.genericSearch)(options, "groupContent");
}
exports.searchGroupContent = searchGroupContent;
//# sourceMappingURL=search.js.map