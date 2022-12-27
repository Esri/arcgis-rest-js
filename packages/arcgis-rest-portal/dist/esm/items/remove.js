/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, appendCustomParams } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { determineOwner } from "./helpers.js";
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
export function removeItem(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/delete`;
        return request(url, requestOptions);
    });
}
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
export function removeItemRelationship(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/deleteRelationship`;
        const options = appendCustomParams(requestOptions, ["originItemId", "destinationItemId", "relationshipType"], { params: Object.assign({}, requestOptions.params) });
        return request(url, options);
    });
}
/**
 * Remove a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item resource.
 */
export function removeItemResource(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/removeResources`;
        // mix in user supplied params
        requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), { resource: requestOptions.resource });
        // only override the deleteAll param specified previously if it is passed explicitly
        if (typeof requestOptions.deleteAll !== "undefined") {
            requestOptions.params.deleteAll = requestOptions.deleteAll;
        }
        return request(url, requestOptions);
    });
}
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
export function removeFolder(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(owner)}/${requestOptions.folderId}/delete`;
        return request(url, requestOptions);
    });
}
//# sourceMappingURL=remove.js.map