/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItemUpdate } from "../helpers.js";
import { getPortalUrl } from "../util/get-portal-url.js";

export interface IUpdateGroupOptions extends IRequestOptions {
  group: IItemUpdate;
}

/**
 * ```js
 * import { updateGroup } from '@esri/arcgis-rest-portal';
 * //
 * updateGroup({
 *   group: { id: "fgr344", title: "new" }
 * })
 *   .then(response)
 * ```
 * Update the properties of a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-group.htm) for more information.
 *
 * @param requestOptions - Options for the request, including the group
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function updateGroup(
  requestOptions: IUpdateGroupOptions
): Promise<{ success: boolean; groupId: string }> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.group.id
  }/update`;

  requestOptions.params = {
    ...requestOptions.params,
    ...requestOptions.group
  };

  return request(url, requestOptions);
}
