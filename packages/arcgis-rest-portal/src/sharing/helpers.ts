/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IUserRequestOptions,
  IGroup,
  IUser,
  GroupMembership
} from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { getGroup } from "../groups/get.js";
import { getSelf } from "../util/get-portal.js";

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

export function getSharingUrl(
  requestOptions: ISharingOptions,
  username?: string
): string {
  const providedUsername =
    username || (requestOptions.authentication as any).username; // as any workaround for backward compatibility for discovering username from provided auth method
  const owner = requestOptions.owner || providedUsername;
  return `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(
    owner
  )}/items/${requestOptions.id}/share`;
}

export function isItemOwner(
  requestOptions: ISharingOptions,
  username?: string
): boolean {
  const providedUsername =
    username || (requestOptions.authentication as any).username; // as any workaround for backward compatibility for discovering username from provided auth method
  const owner = requestOptions.owner || providedUsername;
  return owner === providedUsername;
}

/**
 * Check it the user is a full org_admin
 * @param requestOptions
 * @returns Promise resolving in a boolean indicating if the user is an ArcGIS Organization administrator
 */
export function isOrgAdmin(
  requestOptions: IUserRequestOptions
): Promise<boolean> {
  return requestOptions.authentication.getUser().then((user: IUser) => {
    return user && user.role === "org_admin" && !user.roleId;
  });
}

/**
 * Get the User Membership for a particular group. Use this if all you have is the groupId.
 * If you have the group object, check the `userMembership.memberType` property instead of calling this method.
 *
 * @param requestOptions
 * @returns A Promise that resolves with "owner" | "admin" | "member" | "none"
 */
export function getUserMembership(
  requestOptions: IGroupSharingOptions
): Promise<GroupMembership> {
  // fetch the group...
  return getGroup(requestOptions.groupId, requestOptions)
    .then((group: IGroup) => {
      return group.userMembership.memberType;
    })
    .catch(() => {
      return "none" as GroupMembership;
    });
}

export interface IGroupSharingOptions extends ISharingOptions {
  /**
   * Group identifier
   */
  groupId: string;
  confirmItemControl?: boolean;
}
