"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFolder = exports.removeItemResource = exports.removeItemRelationship = exports.removeItem = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const helpers_js_1 = require("./helpers.js");
/**
 * Delete an item from the portal. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-item.htm) for more information.
 *
 * ```js
 * import { removeItem } from "@esri/arcgis-rest-portal";
 *
 * removeItem({
 *   id: "3ef",
 *   authentication
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item.
 */
function removeItem(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/delete`;
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.removeItem = removeItem;
/**
 * Remove a relationship between two items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-relationship.htm) for more information.
 *
 * ```js
 * import { removeItemRelationship } from "@esri/arcgis-rest-portal";
 *
 * removeItemRelationship({
 *   originItemId: '3ef',
 *   destinationItemId: 'ae7',
 *   relationshipType: 'Service2Layer',
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to add item resources.
 */
function removeItemRelationship(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/deleteRelationship`;
        const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, ["originItemId", "destinationItemId", "relationshipType"], { params: Object.assign({}, requestOptions.params) });
        return (0, arcgis_rest_request_1.request)(url, options);
    });
}
exports.removeItemRelationship = removeItemRelationship;
/**
 * Remove a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item resource.
 */
function removeItemResource(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/removeResources`;
        // mix in user supplied params
        requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), { resource: requestOptions.resource });
        // only override the deleteAll param specified previously if it is passed explicitly
        if (typeof requestOptions.deleteAll !== "undefined") {
            requestOptions.params.deleteAll = requestOptions.deleteAll;
        }
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.removeItemResource = removeItemResource;
/**
 * Delete a non-root folder and all the items it contains. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-folder.htm) for more information.
 *
 * ```js
 * import { removeFolder } from "@esri/arcgis-rest-portal";
 *
 * removeFolder({
 *   folderId: "fe4",
 *   owner: "c@sey",
 *   authentication
 * })
 *   .then(response)
 *
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes a folder
 */
function removeFolder(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${encodeURIComponent(owner)}/${requestOptions.folderId}/delete`;
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.removeFolder = removeFolder;
//# sourceMappingURL=remove.js.map