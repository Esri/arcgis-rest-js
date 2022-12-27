"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTags = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Users tag the content they publish in their portal via the add and update item calls. This resource lists all the tags used by the user along with the number of times the tags have been used. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-tags.htm) for more information.
 *
 * ```js
 * import { getUserTags } from '@esri/arcgis-rest-portal';
 *
 * getUserTags({
 *   username: "jsmith",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param IGetUserOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user tag array
 */
function getUserTags(requestOptions) {
    const username = requestOptions.username || requestOptions.authentication.username;
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/users/${encodeURIComponent(username)}/tags`;
    // send the request
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
exports.getUserTags = getUserTags;
//# sourceMappingURL=get-user-tags.js.map