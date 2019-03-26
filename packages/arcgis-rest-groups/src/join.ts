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
 * Join a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/join-group.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function joinGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<{ success: boolean; groupId: string }> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/join`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}

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
 * Leave a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/leave-group.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function leaveGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<{ success: boolean; groupId: string }> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/leave`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}
