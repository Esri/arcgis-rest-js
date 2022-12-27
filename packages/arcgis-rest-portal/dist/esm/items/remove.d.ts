import { IUserItemOptions, IRemoveItemResourceOptions, IFolderIdOptions, IManageItemRelationshipOptions } from "./helpers.js";
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
export declare function removeItem(requestOptions: IUserItemOptions): Promise<{
    success: boolean;
    itemId: string;
}>;
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
export declare function removeItemRelationship(requestOptions: IManageItemRelationshipOptions): Promise<{
    success: boolean;
}>;
/**
 * Remove a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item resource.
 */
export declare function removeItemResource(requestOptions: IRemoveItemResourceOptions): Promise<{
    success: boolean;
}>;
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
export declare function removeFolder(requestOptions: IFolderIdOptions): Promise<{
    success: boolean;
    folder: {
        username: string;
        id: string;
        title: string;
    };
}>;
