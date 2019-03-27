/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IGroupIdRequestOptions } from "./helpers";

/**
 * ```js
 * import { joinGroup } from '@esri/arcgis-rest-groups';
 * //
 * joinGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Make a request as the authenticated user to join a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/join-group.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
 */
export function joinGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<{ success: boolean; groupId: string }> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/join`;

  return request(url, requestOptions);
}

/**
 * ```js
 * import { leaveGroup } from '@esri/arcgis-rest-groups';
 * //
 * leaveGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Make a request as the authenticated user to leave a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/leave-group.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
 */
export function leaveGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<{ success: boolean; groupId: string }> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/leave`;

  return request(url, requestOptions);
}
