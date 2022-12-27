"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGroupUsers = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const array_js_1 = require("../util/array.js");
/**
 * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm) for more information.
 *
 * ```js
 * import { removeGroupUsers } from "@esri/arcgis-rest-portal";
 *
 * removeGroupUsers({
 *   id: groupId,
 *   users: ["username1", "username2"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
function removeGroupUsers(requestOptions) {
    const { id, users: usersToRemove } = requestOptions;
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${id}/removeUsers`;
    const safeSend = (users) => {
        const options = Object.assign(Object.assign({}, requestOptions), { users, params: { users } });
        return (0, arcgis_rest_request_1.request)(url, options).catch((error) => ({ errors: [error] }));
    };
    // the ArcGIS REST API only allows to add no more than 25 users per request,
    // see https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm
    const promises = (0, array_js_1.chunk)(usersToRemove, 25).map((usersChunk) => safeSend(usersChunk));
    return Promise.all(promises).then((results) => {
        const filtered = (propName) => results
            .filter((result) => result[propName])
            .reduce((collection, result) => collection.concat(result[propName]), []);
        const errors = filtered("errors");
        const consolidated = {
            notRemoved: filtered("notRemoved")
        };
        return errors.length ? Object.assign(Object.assign({}, consolidated), { errors }) : consolidated;
    });
}
exports.removeGroupUsers = removeGroupUsers;
//# sourceMappingURL=remove-users.js.map