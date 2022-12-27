"use strict";
/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchItems = void 0;
const generic_search_js_1 = require("../util/generic-search.js");
/**
 * Search a portal for items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/search.htm) for more information.
 *
 * ```js
 * import { searchItems } from "@esri/arcgis-rest-portal";
 *
 * searchItems('water')
 *   .then(response) // response.total => 355
 * ```
 *
 * @param search - A string or RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
function searchItems(search) {
    return (0, generic_search_js_1.genericSearch)(search, "item");
}
exports.searchItems = searchItems;
//# sourceMappingURL=search.js.map