"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotification = exports.getUserNotifications = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Get notifications for a user.
 *
 * ```js
 * import { getUserNotifications } from '@esri/arcgis-rest-portal';
 *
 * getUserNotifications({ authentication })
 *   .then(results) // results.notifications.length) => 3
 * ```
 *
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user's notifications
 */
function getUserNotifications(requestOptions) {
    let options = { httpMethod: "GET" };
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = (0, get_portal_url_js_1.getPortalUrl)(requestOptions);
    const url = `${portalUrl}/community/users/${username}/notifications`;
    options = Object.assign(Object.assign({}, requestOptions), options);
    // send the request
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getUserNotifications = getUserNotifications;
/**
 * Delete a notification.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
function removeNotification(requestOptions) {
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = (0, get_portal_url_js_1.getPortalUrl)(requestOptions);
    const url = `${portalUrl}/community/users/${username}/notifications/${requestOptions.id}/delete`;
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
exports.removeNotification = removeNotification;
//# sourceMappingURL=notification.js.map