/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroup, IUser, GroupMembership } from "@esri/arcgis-rest-types";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { getPortalUrl } from "../util/get-portal-url";
import { getGroup } from "../groups/get";

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

export function getSharingUrl(requestOptions: ISharingOptions): string {
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;
  return `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(
    owner
  )}/items/${requestOptions.id}/share`;
}

export function isItemOwner(requestOptions: ISharingOptions): boolean {
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;
  return owner === username;
}

/**
 * Check it the user is a full org_admin
 * @param requestOptions
 * @returns Promise resolving in a boolean indicating if the user is an ArcGIS Organization administrator
 */
export function isOrgAdmin(
  requestOptions: IUserRequestOptions
): Promise<boolean> {
  const session = requestOptions.authentication;

  return session.getUser(requestOptions).then((user: IUser) => {
    return user && user.role === "org_admin" && !user.roleId;
  });
}

/**
 * Get the User Membership for a particular group. Use this if all you have is the groupId.
 * If you have the group object, check the `userMembership.memberType` property instead of calling this method.
 *
 * @param requestOptions
 * @returns A Promise that resolves with "owner" | "admin" | "member" | "nonmember"
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
