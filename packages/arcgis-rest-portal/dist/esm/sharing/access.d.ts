import { ISharingOptions, ISharingResponse } from "./helpers.js";
export interface ISetAccessOptions extends ISharingOptions {
    /**
     * "private" indicates that the item can only be accessed by the user. "public" means accessible to anyone. An item shared to the organization has an access level of "org".
     */
    access: "private" | "org" | "public";
}
/**
 * Change who is able to access an item.
 *
 * ```js
 * import { setItemAccess } from "@esri/arcgis-rest-portal";
 *
 * setItemAccess({
 *   id: "abc123",
 *   access: "public", // 'org' || 'private'
 *   authentication: session
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function setItemAccess(requestOptions: ISetAccessOptions): Promise<ISharingResponse>;
