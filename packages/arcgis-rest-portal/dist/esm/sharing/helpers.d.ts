import { IUserRequestOptions, GroupMembership } from "@esri/arcgis-rest-request";
export interface ISharingOptions extends IUserRequestOptions {
    /**
     * Unique identifier for the item.
     */
    id: string;
    /**
     * Item owner, if different from the authenticated user.
     */
    owner?: string;
}
export interface ISharingResponse {
    notSharedWith?: string[];
    notUnsharedFrom?: string[];
    itemId: string;
}
export declare function getSharingUrl(requestOptions: ISharingOptions): string;
export declare function isItemOwner(requestOptions: ISharingOptions): boolean;
/**
 * Check it the user is a full org_admin
 * @param requestOptions
 * @returns Promise resolving in a boolean indicating if the user is an ArcGIS Organization administrator
 */
export declare function isOrgAdmin(requestOptions: IUserRequestOptions): Promise<boolean>;
/**
 * Get the User Membership for a particular group. Use this if all you have is the groupId.
 * If you have the group object, check the `userMembership.memberType` property instead of calling this method.
 *
 * @param requestOptions
 * @returns A Promise that resolves with "owner" | "admin" | "member" | "nonmember"
 */
export declare function getUserMembership(requestOptions: IGroupSharingOptions): Promise<GroupMembership>;
export interface IGroupSharingOptions extends ISharingOptions {
    /**
     * Group identifier
     */
    groupId: string;
    confirmItemControl?: boolean;
}
