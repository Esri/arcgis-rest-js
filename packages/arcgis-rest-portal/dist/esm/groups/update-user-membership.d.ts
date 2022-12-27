import { IUserRequestOptions } from "@esri/arcgis-rest-request";
export interface IUpdateGroupUsersResult {
    /**
     * Array of results
     */
    results: any[];
}
export interface IUpdateGroupUsersOptions extends IUserRequestOptions {
    /**
     * Group ID
     */
    id: string;
    /**
     * An array of usernames to be updated
     */
    users: string[];
    /**
     * Membership Type to update to
     */
    newMemberType: "member" | "admin";
}
/**
 * Change the user membership levels of existing users in a group
 *
 * ```js
 * import { updateUserMemberships } from "@esri/arcgis-rest-portal";
 *
 * updateUserMemberships({
 *   id: groupId,
 *   admins: ["username3"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
export declare function updateUserMemberships(requestOptions: IUpdateGroupUsersOptions): Promise<IUpdateGroupUsersResult>;
