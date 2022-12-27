"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = exports.createItemInFolder = exports.createFolder = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const helpers_js_1 = require("./helpers.js");
/**
 * Create a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/create-folder.htm) for more information.
 *
 * ```js
 * import { createFolder } from "@esri/arcgis-rest-portal";
 *
 * createFolder({
 *   title: 'Map Collection',
 *   authentication: ArcGISIdentityManager
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with folder details once the folder has been created
 */
function createFolder(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const baseUrl = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}`;
        const url = `${baseUrl}/createFolder`;
        requestOptions.params = Object.assign({ title: requestOptions.title }, requestOptions.params);
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.createFolder = createFolder;
/**
 * Create an item in a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item.htm) for more information.
 *
 * ```js
 * import { createItemInFolder } from "@esri/arcgis-rest-portal";
 *
 * createItemInFolder({
 *   item: {
 *     title: "The Amazing Voyage",
 *     type: "Web Map"
 *   },
 *   folderId: 'fe8',
 *   authentication
 * })
 * ```
 *
 * @param requestOptions = Options for the request
 */
function createItemInFolder(requestOptions) {
    if (requestOptions.multipart && !requestOptions.filename) {
        return Promise.reject(new Error("The filename is required for a multipart request."));
    }
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const baseUrl = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}`;
        let url = `${baseUrl}/addItem`;
        if (requestOptions.folderId) {
            url = `${baseUrl}/${requestOptions.folderId}/addItem`;
        }
        requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.item);
        // convert extent, if present, into a string from bbox
        // processParams was previously doing this sort of work,
        // however now we need to let array of arrays through
        // Thus for extents we need to move this logic here
        if (requestOptions.params.extent && (0, helpers_js_1.isBBox)(requestOptions.params.extent)) {
            requestOptions.params.extent = (0, helpers_js_1.bboxToString)(requestOptions.params.extent);
        }
        // serialize the item into something Portal will accept
        const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [
            "owner",
            "folderId",
            "file",
            "dataUrl",
            "text",
            "async",
            "multipart",
            "filename",
            "overwrite"
        ], {
            params: Object.assign({}, requestOptions.params)
        });
        return (0, arcgis_rest_request_1.request)(url, options);
    });
}
exports.createItemInFolder = createItemInFolder;
/**
 * Create an Item in the user's root folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item.htm) for more information.
 *
 * ```js
 * import { createItem } from "@esri/arcgis-rest-portal";
 *
 * createItem({
 *   item: {
 *     title: "The Amazing Voyage",
 *     type: "Web Map"
 *   },
 *   authentication
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that creates an item.
 */
function createItem(requestOptions) {
    // delegate to createItemInFolder placing in the root of the filestore
    const options = Object.assign({ folderId: null }, requestOptions);
    return createItemInFolder(options);
}
exports.createItem = createItem;
//# sourceMappingURL=create.js.map