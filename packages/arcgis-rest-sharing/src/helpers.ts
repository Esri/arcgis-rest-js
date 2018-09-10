/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, getPortalUrl } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IGroup, IUser, GroupMembership } from "@esri/arcgis-rest-common-types";
import { getGroup } from "@esri/arcgis-rest-groups";
import { IGroupSharingRequestOptions } from "./group-sharing";

export interface ISharingRequestOptions extends IRequestOptions {
  /**
   * Unique identifier for the item.
   */
  id: string;
  /**
   * Represents a user with privileges to update item sharing.
   */
  authentication: UserSession;
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

export function getSharingUrl(requestOptions: ISharingRequestOptions): string {
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;
  return `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(
    owner
  )}/items/${requestOptions.id}/share`;
}

export function isItemOwner(requestOptions: ISharingRequestOptions): boolean {
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
  requestOptions: ISharingRequestOptions
): Promise<boolean> {
  const session = requestOptions.authentication as UserSession;

  return session.getUser(requestOptions).then((user: IUser) => {
    if (!user || user.role !== "org_admin") {
      return false;
    } else {
      return true;
    }
  });
}

/**
 * Get the User Membership for a particular group. Use this if all you have is the groupId.
 * If you have the group object, check the `userMembership.memberType` property instead of calling this method.
 *
 * @param IGroupIdRequestOptions options to pass through in the request
 * @returns A Promise that resolves with "owner" | "admin" | "member" | "nonmember"
 */
export function getUserMembership(
  requestOptions: IGroupSharingRequestOptions
): Promise<GroupMembership> {
  // fetch the group...
  return getGroup(requestOptions.groupId, requestOptions)
    .then((group: IGroup) => {
      return group.userMembership.memberType;
    })
    .catch(() => {
      return "nonmember" as GroupMembership;
    });
}
