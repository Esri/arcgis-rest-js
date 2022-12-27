/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { determineOwner, isBBox, bboxToString } from "./helpers.js";
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
export function updateItem(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = requestOptions.folderId
            ? `${getPortalUrl(requestOptions)}/content/users/${owner}/${requestOptions.folderId}/items/${requestOptions.item.id}/update`
            : `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.item.id}/update`;
        // serialize the item into something Portal will accept
        requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.item);
        // convert extent, if present, into a string from bbox
        // processParams was previously doing this sort of work,
        // however now we need to let array of arrays through
        // Thus for extents we need to move this logic here
        if (requestOptions.params.extent && isBBox(requestOptions.params.extent)) {
            requestOptions.params.extent = bboxToString(requestOptions.params.extent);
        }
        return request(url, requestOptions);
    });
}
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
export function updateItemInfo(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/updateinfo`;
        // mix in user supplied params
        requestOptions.params = Object.assign({ folderName: requestOptions.folderName, file: requestOptions.file }, requestOptions.params);
        return request(url, requestOptions);
    });
}
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
export function updateItemResource(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/updateResources`;
        // mix in user supplied params
        requestOptions.params = Object.assign({ file: requestOptions.resource, fileName: requestOptions.name, resourcesPrefix: requestOptions.prefix, text: requestOptions.content }, requestOptions.params);
        // only override the access specified previously if 'private' is passed explicitly
        if (typeof requestOptions.private !== "undefined") {
            requestOptions.params.access = requestOptions.private
                ? "private"
                : "inherit";
        }
        return request(url, requestOptions);
    });
}
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
export function moveItem(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.itemId}/move`;
        let folderId = requestOptions.folderId;
        if (!folderId) {
            folderId = "/";
        }
        requestOptions.params = Object.assign({ folder: folderId }, requestOptions.params);
        return request(url, requestOptions);
    });
}
//# sourceMappingURL=update.js.map