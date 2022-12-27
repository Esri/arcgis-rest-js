"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGroupUsers = exports.getGroupUsers = exports.getGroupContent = exports.getGroupCategorySchema = exports.getGroup = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Fetch a group using its id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group.htm) for more information.
 *
 * ```js
 * import { getGroup } from "@esri/arcgis-rest-portal";
 * //
 * getGroup("fxb988") // id
 *   .then(response)
 * ```
 *
 * @param id - Group Id
 * @param requestOptions  - Options for the request
 * @returns  A Promise that will resolve with the data from the response.
 */
function getGroup(id, requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${id}`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getGroup = getGroup;
/**
 * Gets the category schema set on a group
 *
 * @param id - Group Id
 * @param requestOptions  - Options for the request
 * @returns A promise that will resolve with JSON of group's category schema
 * @see https://developers.arcgis.com/rest/users-groups-and-items/group-category-schema.htm
 */
function getGroupCategorySchema(id, requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${id}/categorySchema`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getGroupCategorySchema = getGroupCategorySchema;
/**
 * Returns the content of a Group. Since the group may contain 1000s of items
 * the requestParams allow for paging.
 * @param id - Group Id
 * @param requestOptions  - Options for the request, including paging parameters.
 * @returns  A Promise that will resolve with the content of the group.
 */
function getGroupContent(id, requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/groups/${id}`;
    // default to a GET request
    const options = Object.assign(Object.assign({ httpMethod: "GET" }, { params: { start: 1, num: 100 } }), requestOptions);
    // is this the most concise way to mixin with the defaults above?
    if (requestOptions && requestOptions.paging) {
        options.params = Object.assign({}, requestOptions.paging);
    }
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getGroupContent = getGroupContent;
/**
 * Get the usernames of the admins and members. Does not return actual 'User' objects. Those must be
 * retrieved via separate calls to the User's API.
 * @param id - Group Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with arrays of the group admin usernames and the member usernames
 */
function getGroupUsers(id, requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${id}/users`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getGroupUsers = getGroupUsers;
/**
 * Search the users in a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-users-list.htm) for more information.
 *
 * ```js
 * import { searchGroupUsers } from "@esri/arcgis-rest-portal";
 *
 * searchGroupUsers('abc123')
 *   .then(response)
 * ```
 *
 * @param id - The group id
 * @param searchOptions - Options for the request, including paging parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
function searchGroupUsers(id, searchOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(searchOptions)}/community/groups/${id}/userlist`;
    const options = (0, arcgis_rest_request_1.appendCustomParams)(searchOptions || {}, ["name", "num", "start", "sortField", "sortOrder", "joined", "memberType"], {
        httpMethod: "GET"
    });
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.searchGroupUsers = searchGroupUsers;
//# sourceMappingURL=get.js.map