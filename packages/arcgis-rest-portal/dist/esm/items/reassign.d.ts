import { IUserRequestOptions } from "@esri/arcgis-rest-request";
interface IReassignItemOptions extends IUserRequestOptions {
    id: string;
    currentOwner: string;
    targetUsername: string;
    targetFolderName?: string;
}
interface IReassignItemResponse {
    success: boolean;
    itemId: string;
}
/**
 * Reassign an item from one user to another. Caller must be an org admin or the request will fail. `currentOwner` and `targetUsername` must be in the same organization or the request will fail
 *
 * ```js
 * import { reassignItem } from '@esri/arcgis-rest-portal';
 *
 * reassignItem({
 *   id: "abc123",
 *   currentOwner: "charles",
 *   targetUsername: "leslie",
 *   authentication
 * })
 * ```
 *
 * @param reassignOptions - Options for the request
 */
export declare function reassignItem(reassignOptions: IReassignItemOptions): Promise<IReassignItemResponse>;
export {};
