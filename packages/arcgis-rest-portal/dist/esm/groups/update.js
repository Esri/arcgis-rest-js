/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
/**
 * Update the properties of a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-group.htm) for more information.
 *
 * ```js
 * import { updateGroup } from '@esri/arcgis-rest-portal';
 *
 * updateGroup({
 *   group: { id: "fgr344", title: "new" }
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request, including the group
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function updateGroup(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.group.id}/update`;
    requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.group);
    return request(url, requestOptions);
}
//# sourceMappingURL=update.js.map