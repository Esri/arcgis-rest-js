/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
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
export function protectGroup(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/protect`;
    return request(url, requestOptions);
}
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
export function unprotectGroup(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/unprotect`;
    return request(url, requestOptions);
}
//# sourceMappingURL=protect.js.map