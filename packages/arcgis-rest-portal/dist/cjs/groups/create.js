"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroup = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
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
function createGroup(requestOptions) {
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/createGroup`;
    requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.group);
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
exports.createGroup = createGroup;
//# sourceMappingURL=create.js.map