/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
/**
 * Create a group notification.
 *
 * ```js
 * import { createGroupNotification } from '@esri/arcgis-rest-portal';
 * // send an email to an entire group
 * createGroupNotification({
 *   authentication: ArcGISIdentityManager,
 *   subject: "hello",
 *   message: "world!",
 *   id: groupId
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function createGroupNotification(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/createNotification`;
    const options = Object.assign({ params: Object.assign({ subject: requestOptions.subject, message: requestOptions.message, users: requestOptions.users, notificationChannelType: requestOptions.notificationChannelType || "email", clientId: requestOptions.clientId, silentNotification: requestOptions.silentNotification, notifyAll: !requestOptions.users || requestOptions.users.length === 0 }, requestOptions.params) }, requestOptions);
    return request(url, options);
}
//# sourceMappingURL=notification.js.map