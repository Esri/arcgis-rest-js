"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGroup = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Delete a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-group.htm) for more information.
 *
 * ```js
 * import { removeGroup } from '@esri/arcgis-rest-portal';
 * //
 * removeGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
function removeGroup(requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/groups/${requestOptions.id}/delete`;
    const options = Object.assign({}, requestOptions);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.removeGroup = removeGroup;
//# sourceMappingURL=remove.js.map