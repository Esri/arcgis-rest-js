import { IRequestOptions, ArcGISRequestError } from "@esri/arcgis-rest-request";
export interface IRemoveGroupUsersOptions extends IRequestOptions {
    /**
     * Group ID
     */
    id: string;
    /**
     * An array of usernames to be removed from the group
     */
    users?: string[];
}
export interface IRemoveGroupUsersResult {
    /**
     * An array of usernames that were not removed
     */
    notRemoved?: string[];
    /**
     * An array of request errors
     */
    errors?: ArcGISRequestError[];
}
/**
 * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm) for more information.
 *
 * ```js
 * import { removeGroupUsers } from "@esri/arcgis-rest-portal";
 *
 * removeGroupUsers({
 *   id: groupId,
 *   users: ["username1", "username2"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
export declare function removeGroupUsers(requestOptions: IRemoveGroupUsersOptions): Promise<IRemoveGroupUsersResult>;
