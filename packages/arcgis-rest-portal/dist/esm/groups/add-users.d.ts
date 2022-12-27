import { IRequestOptions, ArcGISRequestError } from "@esri/arcgis-rest-request";
export interface IAddGroupUsersOptions extends IRequestOptions {
    /**
     * Group ID
     */
    id: string;
    /**
     * An array of usernames to be added to the group as group members
     */
    users?: string[];
    /**
     * An array of usernames to be added to the group as group admins
     */
    admins?: string[];
}
export interface IAddGroupUsersResult {
    /**
     * An array of usernames that were not added
     */
    notAdded?: string[];
    /**
     * An array of request errors
     */
    errors?: ArcGISRequestError[];
}
/**
 * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-users-to-group.htm) for more information.
 *
 * ```js
 * import { addGroupUsers } from "@esri/arcgis-rest-portal";
 * //
 * addGroupUsers({
 *   id: groupId,
 *   users: ["username1", "username2"],
 *   admins: ["username3"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
export declare function addGroupUsers(requestOptions: IAddGroupUsersOptions): Promise<IAddGroupUsersResult>;
