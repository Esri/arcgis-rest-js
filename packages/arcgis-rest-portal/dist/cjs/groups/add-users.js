"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGroupUsers = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const array_js_1 = require("../util/array.js");
/**
 * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-users-to-group.htm) for more information.
 *
 * ```js
 * import { addGroupUsers } from "@esri/arcgis-rest-portal";
 * //
 * addGroupUsers({
 *   id: groupId,
 *   users: ["username1", "username2"],
 *   admins: ["username3"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
function addGroupUsers(requestOptions) {
    const id = requestOptions.id;
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${id}/addUsers`;
    const baseOptions = Object.assign({}, requestOptions, {
        admins: undefined,
        users: undefined
    });
    const batchRequestOptions = [
        ..._prepareRequests("users", requestOptions.users, baseOptions),
        ..._prepareRequests("admins", requestOptions.admins, baseOptions)
    ];
    const promises = batchRequestOptions.map((options) => _sendSafeRequest(url, options));
    return Promise.all(promises).then(_consolidateRequestResults);
}
exports.addGroupUsers = addGroupUsers;
function _prepareRequests(type, usernames, baseOptions) {
    if (!usernames || usernames.length < 1) {
        return [];
    }
    // the ArcGIS REST API only allows to add no more than 25 users per request,
    // see https://developers.arcgis.com/rest/users-groups-and-items/add-users-to-group.htm
    const userChunks = (0, array_js_1.chunk)(usernames, 25);
    return userChunks.map((users) => _generateRequestOptions(type, users, baseOptions));
}
function _generateRequestOptions(type, usernames, baseOptions) {
    return Object.assign({}, baseOptions, {
        [type]: usernames,
        params: Object.assign(Object.assign({}, baseOptions.params), { [type]: usernames })
    });
}
// this request is safe since the request error will be handled
function _sendSafeRequest(url, requestOptions) {
    return (0, arcgis_rest_request_1.request)(url, requestOptions).catch((error) => {
        return {
            errors: [error]
        };
    });
}
function _consolidateRequestResults(results) {
    const notAdded = results
        .filter((result) => result.notAdded)
        .reduce((collection, result) => collection.concat(result.notAdded), []);
    const errors = results
        .filter((result) => result.errors)
        .reduce((collection, result) => collection.concat(result.errors), []);
    const consolidated = { notAdded };
    if (errors.length > 0) {
        consolidated.errors = errors;
    }
    return consolidated;
}
//# sourceMappingURL=add-users.js.map