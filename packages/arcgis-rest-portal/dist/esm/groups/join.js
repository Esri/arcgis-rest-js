/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
/**
 * Make a request as the authenticated user to join a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/join-group.htm) for more information.
 *
 * ```js
 * import { joinGroup } from '@esri/arcgis-rest-portal';
 * //
 * joinGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
 */
export function joinGroup(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/join`;
    return request(url, requestOptions);
}
/**
 * Make a request as the authenticated user to leave a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/leave-group.htm) for more information.
 *
 * ```js
 * import { leaveGroup } from '@esri/arcgis-rest-portal';
 *
 * leaveGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
 */
export function leaveGroup(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/leave`;
    return request(url, requestOptions);
}
//# sourceMappingURL=join.js.map