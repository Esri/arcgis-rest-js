import { IUserGroupOptions } from "./helpers.js";
/**
 * Make a request as the authenticated user to join a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/join-group.htm) for more information.
 *
 * ```js
 * import { joinGroup } from '@esri/arcgis-rest-portal';
 * //
 * joinGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
 */
export declare function joinGroup(requestOptions: IUserGroupOptions): Promise<{
    success: boolean;
    groupId: string;
}>;
/**
 * Make a request as the authenticated user to leave a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/leave-group.htm) for more information.
 *
 * ```js
 * import { leaveGroup } from '@esri/arcgis-rest-portal';
 *
 * leaveGroup({
 *   id: groupId,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
 */
export declare function leaveGroup(requestOptions: IUserGroupOptions): Promise<{
    success: boolean;
    groupId: string;
}>;
