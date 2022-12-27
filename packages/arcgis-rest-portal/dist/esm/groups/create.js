/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
/**
 * Create a new Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/create-group.htm) for more information.
 *
 * ```js
 * import { createGroup } from "@esri/arcgis-rest-portal";
 *
 * createGroup({
 *   group: {
 *     title: "No Homers",
 *     access: "public"
 *   },
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * Note: The group name must be unique within the user's organization.
 * @param requestOptions  - Options for the request, including a group object
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function createGroup(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/createGroup`;
    requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.group);
    return request(url, requestOptions);
}
//# sourceMappingURL=create.js.map