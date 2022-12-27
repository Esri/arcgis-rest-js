"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroup = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
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
function updateGroup(requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${requestOptions.group.id}/update`;
    requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.group);
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
exports.updateGroup = updateGroup;
//# sourceMappingURL=update.js.map