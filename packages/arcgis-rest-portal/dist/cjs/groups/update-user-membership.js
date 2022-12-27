"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserMemberships = void 0;
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Change the user membership levels of existing users in a group
 *
 * ```js
 * import { updateUserMemberships } from "@esri/arcgis-rest-portal";
 *
 * updateUserMemberships({
 *   id: groupId,
 *   admins: ["username3"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
function updateUserMemberships(requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${requestOptions.id}/updateUsers`;
    const opts = {
        authentication: requestOptions.authentication,
        params: {}
    };
    // add the correct params depending on the type of membership we are changing to
    if (requestOptions.newMemberType === "admin") {
        opts.params.admins = requestOptions.users;
    }
    else {
        opts.params.users = requestOptions.users;
    }
    // make the request
    return (0, arcgis_rest_request_1.request)(url, opts);
}
exports.updateUserMemberships = updateUserMemberships;
//# sourceMappingURL=update-user-membership.js.map