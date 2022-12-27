import { IUserItemOptions, IItemResourceOptions, IUpdateItemResponse, IItemResourceResponse, IManageItemRelationshipOptions } from "./helpers.js";
export interface IAddItemDataOptions extends IUserItemOptions {
    /**
     * The [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) or [File](https://developer.mozilla.org/en-US/docs/Web/API/File) to store. In Node JS `File` and `Blob` can be imported from `@esri/arcgis-rest-request`
     */
    file?: Blob | File;
    /**
     * Text content to store/
     */
    text?: string;
}
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
export declare function addItemData(requestOptions: IAddItemDataOptions): Promise<IUpdateItemResponse>;
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
export declare function addItemRelationship(requestOptions: IManageItemRelationshipOptions): Promise<{
    success: boolean;
}>;
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
export declare function addItemResource(requestOptions: IItemResourceOptions): Promise<IItemResourceResponse>;
