import { IItemAdd } from "../helpers.js";
import { IUserItemOptions, IUpdateItemResponse, IItemPartOptions } from "./helpers.js";
export interface ICommitItemOptions extends IUserItemOptions {
    item: IItemAdd;
}
/**
 * Add Item Part allows the caller to upload a file part when doing an add or update item operation in multipart mode. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item-part.htm) for more information.
 *
 * ```js
 * import { addItemPart } from "@esri/arcgis-rest-portal";
 *
 * addItemPart({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   file: data,
 *   partNum: 1,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to add the item part status.
 */
export declare function addItemPart(requestOptions?: IItemPartOptions): Promise<IUpdateItemResponse>;
/**
 * Commit is called once all parts are uploaded during a multipart Add Item or Update Item operation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/commit.htm) for more information.
 *
 * ```js
 * import { commitItemUpload } from "@esri/arcgis-rest-portal";
 * //
 * commitItemUpload({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get the commit result.
 */
export declare function commitItemUpload(requestOptions?: ICommitItemOptions): Promise<IUpdateItemResponse>;
/**
 * Cancels a multipart upload on an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/cancel.htm) for more information.
 *
 * ```js
 * import { cancelItemUpload } from "@esri/arcgis-rest-portal";
 * //
 * cancelItemUpload({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get the commit result.
 */
export declare function cancelItemUpload(requestOptions?: IUserItemOptions): Promise<IUpdateItemResponse>;
