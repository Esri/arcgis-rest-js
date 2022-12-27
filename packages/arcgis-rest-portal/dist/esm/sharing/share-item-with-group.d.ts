import { IUser } from "@esri/arcgis-rest-request";
import { IGroupSharingOptions, ISharingResponse } from "./helpers.js";
import { IAddGroupUsersResult } from "../groups/add-users.js";
interface IEnsureMembershipResult {
    promise: Promise<IAddGroupUsersResult>;
    revert: (sharingResults: ISharingResponse) => Promise<ISharingResponse>;
}
/**
 * Share an item with a group, either as an [item owner](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-item-owner-.htm), [group admin](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-group-admin-.htm) or organization admin.
 *
 * Sharing the item as an Admin will use the `/content/users/:ownername/items/:itemid/share` end-point
 *
 * ```js
 * import { shareItemWithGroup } from '@esri/arcgis-rest-portal';
 *
 * shareItemWithGroup({
 *   id: "abc123",
 *   groupId: "xyz987",
 *   owner: "some-owner",
 *   authentication
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function shareItemWithGroup(requestOptions: IGroupSharingOptions): Promise<ISharingResponse>;
export declare function ensureMembership(currentUser: IUser, ownerUser: IUser, shouldPromote: boolean, errorMessage: string, requestOptions: IGroupSharingOptions): IEnsureMembershipResult;
export {};
