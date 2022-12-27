"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unprotectGroup = exports.protectGroup = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Protect a group to avoid accidental deletion. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/protect-group.htm) for more information.
 *
 * ```js
 * import { protectGroup } from '@esri/arcgis-rest-portal';
 *
 * protectGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
function protectGroup(requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${requestOptions.id}/protect`;
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
exports.protectGroup = protectGroup;
/**
 * Unprotect a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/unprotect-group.htm) for more information.
 *
 * ```js
 * import { unprotectGroup } from '@esri/arcgis-rest-portal';
 *
 * unprotectGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
function unprotectGroup(requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${requestOptions.id}/unprotect`;
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
exports.unprotectGroup = unprotectGroup;
//# sourceMappingURL=protect.js.map