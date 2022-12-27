/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, appendCustomParams } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { determineOwner } from "./helpers.js";
import { updateItem } from "./update.js";
/**
 * Send a file or blob to an item to be stored as the `/data` resource. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-item.htm) for more information.
 *
 * ```js
 * import { addItemData } from "@esri/arcgis-rest-portal";
 *
 * addItemData({
 *   id: '3ef',
 *   data: file,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with an object reporting
 *        success/failure and echoing the item id.
 */
export function addItemData(requestOptions) {
    const options = Object.assign({ item: {
            id: requestOptions.id,
            text: requestOptions.text,
            file: requestOptions.file
        } }, requestOptions);
    delete options.id;
    delete options.data;
    return updateItem(options);
}
/**
 * Add a relationship between two items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-relationship.htm) for more information.
 *
 * ```js
 * import { addItemRelationship } from "@esri/arcgis-rest-portal";
 *
 * addItemRelationship({
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
export function addItemRelationship(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/addRelationship`;
        const options = appendCustomParams(requestOptions, ["originItemId", "destinationItemId", "relationshipType"], { params: Object.assign({}, requestOptions.params) });
        return request(url, options);
    });
}
/**
 * Add a resource associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-resources.htm) for more information.
 *
 * ```js
 * import { addItemResource } from "@esri/arcgis-rest-portal";
 *
 * // Add a file resource
 * addItemResource({
 *   id: '3ef',
 *   resource: file,
 *   name: 'bigkahuna.jpg',
 *   authentication
 * })
 *   .then(response)
 *
 * // Add a text resource
 * addItemResource({
 *   id: '4fg',
 *   content: "Text content",
 *   name: 'bigkahuna.txt',
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to add item resources.
 */
export function addItemResource(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/addResources`;
        requestOptions.params = Object.assign({ file: requestOptions.resource, fileName: requestOptions.name, resourcesPrefix: requestOptions.prefix, text: requestOptions.content, access: requestOptions.private ? "private" : "inherit" }, requestOptions.params);
        return request(url, requestOptions);
    });
}
//# sourceMappingURL=add.js.map