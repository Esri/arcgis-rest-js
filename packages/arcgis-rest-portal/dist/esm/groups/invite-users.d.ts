import { IRequestOptions, ArcGISRequestError } from "@esri/arcgis-rest-request";
export interface IInviteGroupUsersOptions extends IRequestOptions {
    /**
     * Group ID
     */
    id: string;
    /**
     * An array of usernames to be added to the group as group members
     */
    users: string[];
    /**
     * What role the users should be invited as ('group_member' | 'group_admin')
     */
    role: string;
    /**
     * Expiration date on the invitation can be set for one day, three days, one week, or two weeks, in minutes.
     */
    expiration: number;
}
export interface IInviteGroupUsersResult {
    /**
     * Whether the operation was successful
     */
    success: boolean;
    /**
     * An array of request errors
     */
    errors?: ArcGISRequestError[];
}
/**
 * Invites users to join a group. Operation success will be indicated by a flag on the return object. If there are any errors, they will be placed in an errors array on the return object.
 *
 * ```js
 * const authentication: IAuthenticationManager; // Typically passed into to the function
 *
 * const options: IInviteGroupUsersOptions = {
 *  id: 'group_id',
 *  users: ['ed', 'edd', 'eddy'],
 *  role: 'group-member',
 *  expiration: 20160,
 *  authentication
 * }
 *
 * const result = await inviteGroupUsers(options);
 *
 * const if_success_result_looks_like = {
 *  success: true
 * }
 *
 * const if_failure_result_looks_like = {
 *  success: false,
 *  errors: [ArcGISRequestError]
 * }
 * ```
 *
 * @param {IInviteGroupUsersOptions} options
 * @returns {Promise<IAddGroupUsersResult>}
 */
export declare function inviteGroupUsers(options: IInviteGroupUsersOptions): Promise<IInviteGroupUsersResult>;
