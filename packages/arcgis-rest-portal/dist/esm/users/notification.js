/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
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
export function getUserNotifications(requestOptions) {
    let options = { httpMethod: "GET" };
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = getPortalUrl(requestOptions);
    const url = `${portalUrl}/community/users/${username}/notifications`;
    options = Object.assign(Object.assign({}, requestOptions), options);
    // send the request
    return request(url, options);
}
/**
 * Delete a notification.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function removeNotification(requestOptions) {
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = getPortalUrl(requestOptions);
    const url = `${portalUrl}/community/users/${username}/notifications/${requestOptions.id}/delete`;
    return request(url, requestOptions);
}
//# sourceMappingURL=notification.js.map