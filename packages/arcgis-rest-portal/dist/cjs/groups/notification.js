"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupNotification = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
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
function createGroupNotification(requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${requestOptions.id}/createNotification`;
    const options = Object.assign({ params: Object.assign({ subject: requestOptions.subject, message: requestOptions.message, users: requestOptions.users, notificationChannelType: requestOptions.notificationChannelType || "email", clientId: requestOptions.clientId, silentNotification: requestOptions.silentNotification, notifyAll: !requestOptions.users || requestOptions.users.length === 0 }, requestOptions.params) }, requestOptions);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.createGroupNotification = createGroupNotification;
//# sourceMappingURL=notification.js.map