import { IItemUpdate } from "../helpers.js";
import { ICreateUpdateItemOptions, IMoveItemResponse, IItemInfoOptions, IItemResourceOptions, IItemInfoResponse, IItemResourceResponse, IUpdateItemResponse } from "./helpers.js";
export interface IUpdateItemOptions extends ICreateUpdateItemOptions {
    item: IItemUpdate;
}
export interface IMoveItemOptions extends ICreateUpdateItemOptions {
    /**
     * Alphanumeric id of item to be moved.
     */
    itemId: string;
    /**
     * Alphanumeric id of folder to house moved item. If null, empty, or "/", the destination is the
     * root folder.
     */
    folderId?: string;
}
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
export declare function updateItem(requestOptions: IUpdateItemOptions): Promise<IUpdateItemResponse>;
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
export declare function updateItemInfo(requestOptions: IItemInfoOptions): Promise<IItemInfoResponse>;
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
export declare function updateItemResource(requestOptions: IItemResourceOptions): Promise<IItemResourceResponse>;
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
export declare function moveItem(requestOptions: IMoveItemOptions): Promise<IMoveItemResponse>;
