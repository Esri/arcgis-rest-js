/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url";
import { IGroupIdRequestOptions } from "./helpers";

/**
 * ```js
 * import { removeGroup } from '@esri/arcgis-rest-portal';
 * //
 * removeGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Delete a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-group.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function removeGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/delete`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}
