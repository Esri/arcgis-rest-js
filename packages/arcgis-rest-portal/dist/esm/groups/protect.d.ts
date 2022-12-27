import { IUserGroupOptions } from "./helpers.js";
/**
 * Protect a group to avoid accidental deletion. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/protect-group.htm) for more information.
 *
 * ```js
 * import { protectGroup } from '@esri/arcgis-rest-portal';
 *
 * protectGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export declare function protectGroup(requestOptions: IUserGroupOptions): Promise<{
    success: boolean;
}>;
/**
 * Unprotect a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/unprotect-group.htm) for more information.
 *
 * ```js
 * import { unprotectGroup } from '@esri/arcgis-rest-portal';
 *
 * unprotectGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export declare function unprotectGroup(requestOptions: IUserGroupOptions): Promise<{
    success: boolean;
}>;
