"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveItem = exports.updateItemResource = exports.updateItemInfo = exports.updateItem = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const helpers_js_1 = require("./helpers.js");
/**
 * Update an Item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-item.htm) for more information.
 *
 * ```js
 * import { updateItem } from "@esri/arcgis-rest-portal";
 *
 * updateItem({
 *   item: {
 *     id: "3ef",
 *     description: "A three hour tour"
 *   },
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that updates an item.
 */
function updateItem(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = requestOptions.folderId
            ? `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/${requestOptions.folderId}/items/${requestOptions.item.id}/update`
            : `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.item.id}/update`;
        // serialize the item into something Portal will accept
        requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.item);
        // convert extent, if present, into a string from bbox
        // processParams was previously doing this sort of work,
        // however now we need to let array of arrays through
        // Thus for extents we need to move this logic here
        if (requestOptions.params.extent && (0, helpers_js_1.isBBox)(requestOptions.params.extent)) {
            requestOptions.params.extent = (0, helpers_js_1.bboxToString)(requestOptions.params.extent);
        }
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.updateItem = updateItem;
/**
 * Update an info file associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-info.htm) for more information.
 *
 * ```js
 * import { updateItemInfo } from "@esri/arcgis-rest-portal";
 *
 * updateItemInfo({
 *   id: '3ef',
 *   file: file,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that updates an item info file.
 */
function updateItemInfo(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/updateinfo`;
        // mix in user supplied params
        requestOptions.params = Object.assign({ folderName: requestOptions.folderName, file: requestOptions.file }, requestOptions.params);
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.updateItemInfo = updateItemInfo;
/**
 * Update an info file associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-info.htm) for more information.
 *
 * ```js
 * import { updateItemResource } from "@esri/arcgis-rest-portal";
 *
 * updateItemResource({
 *   id: '3ef',
 *   resource: file,
 *   name: 'bigkahuna.jpg',
 *   authentication
 * })
 *   .then(response)
 * ```
 * Update a resource associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-resources.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that updates an item resource.
 */
function updateItemResource(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/updateResources`;
        // mix in user supplied params
        requestOptions.params = Object.assign({ file: requestOptions.resource, fileName: requestOptions.name, resourcesPrefix: requestOptions.prefix, text: requestOptions.content }, requestOptions.params);
        // only override the access specified previously if 'private' is passed explicitly
        if (typeof requestOptions.private !== "undefined") {
            requestOptions.params.access = requestOptions.private
                ? "private"
                : "inherit";
        }
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.updateItemResource = updateItemResource;
/**
 * Move an item to a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/move-item.htm) for more information.
 *
 * ```js
 * import { moveItem } from "@esri/arcgis-rest-portal";
 * //
 * moveItem({
 *   itemId: "3ef",
 *   folderId: "7c5",
 *   authentication: ArcGISIdentityManager
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with owner and folder details once the move has been completed
 */
function moveItem(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.itemId}/move`;
        let folderId = requestOptions.folderId;
        if (!folderId) {
            folderId = "/";
        }
        requestOptions.params = Object.assign({ folder: folderId }, requestOptions.params);
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.moveItem = moveItem;
//# sourceMappingURL=update.js.map