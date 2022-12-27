import { IItemAdd } from "../helpers.js";
import { IAddFolderResponse, IUpdateItemResponse, ICreateUpdateItemOptions } from "./helpers.js";
export interface ICreateFolderOptions extends ICreateUpdateItemOptions {
    /**
     * Name of the folder to create.
     */
    title: string;
}
export interface ICreateItemOptions extends ICreateUpdateItemOptions {
    item: IItemAdd;
}
export interface ICreateItemResponse extends IUpdateItemResponse {
    folder: string;
}
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
export declare function createFolder(requestOptions: ICreateFolderOptions): Promise<IAddFolderResponse>;
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
export declare function createItemInFolder(requestOptions: ICreateItemOptions): Promise<ICreateItemResponse>;
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
export declare function createItem(requestOptions: ICreateItemOptions): Promise<ICreateItemResponse>;
