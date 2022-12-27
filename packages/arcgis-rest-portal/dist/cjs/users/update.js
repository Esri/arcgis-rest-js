"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Update a user profile. The username will be extracted from the authentication session unless it is provided explicitly. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-user.htm) for more information.
 *
 * ```js
 * import { updateUser } from '@esri/arcgis-rest-portal';
 *
 * // any user can update their own profile
 * updateUser({
 *   authentication,
 *   user: { description: "better than the last one" }
 * })
 *   .then(response)
 *
 * // org administrators must declare the username that will be updated explicitly
 * updateUser({
 *   authentication,
 *   user: { username: "c@sey", description: "" }
 * })
 *   .then(response)
 * // => { "success": true, "username": "c@sey" }
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metadata about the user
 */
function updateUser(requestOptions) {
    // default to the authenticated username unless another username is provided manually
    const username = requestOptions.user.username || requestOptions.authentication.username;
    const updateUrl = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/users/${encodeURIComponent(username)}/update`;
    // mixin custom params and the user information, then drop the user info
    requestOptions.params = Object.assign(Object.assign({}, requestOptions.user), requestOptions.params);
    delete requestOptions.user;
    // send the request
    return (0, arcgis_rest_request_1.request)(updateUrl, requestOptions);
}
exports.updateUser = updateUser;
//# sourceMappingURL=update.js.map