import { IGroupSharingOptions } from "./helpers.js";
/**
 * Find out whether or not an item is already shared with a group.
 *
 * ```js
 * import { isItemSharedWithGroup } from "@esri/arcgis-rest-portal";
 *
 * isItemSharedWithGroup({
 *   groupId: 'bc3,
 *   itemId: 'f56,
 *   authentication
 * })
 * .then(isShared => {})
 * ```
 
 *
 * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
 * @returns Promise that will resolve with true/false
 */
export declare function isItemSharedWithGroup(requestOptions: IGroupSharingOptions): Promise<boolean>;
