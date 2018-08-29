/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IUser, IGroup } from "@esri/arcgis-rest-common-types";
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

export function isOrgAdmin(
  requestOptions: ISharingRequestOptions
): Promise<boolean> {
  const session = requestOptions.authentication as UserSession;

  return session.getUser(requestOptions).then((user: IUser): boolean => {
    if (!user || user.role !== "org_admin") {
      return false;
    } else {
      return true;
    }
  });
}

export function getUserMembership(
  requestOptions: IGroupSharingRequestOptions
): Promise<string | void> {
  // start by assuming the user does not belong to the group
  let result = "nonmember";
  const session = requestOptions.authentication as UserSession;

  // the response to this call is cached. yay!
  return session
    .getUser(requestOptions)
    .then((user: IUser) => {
      if (user.groups) {
        user.groups.some(function(group: IGroup) {
          const matchedGroup = group.id === requestOptions.groupId;
          if (matchedGroup) {
            result = group.userMembership.memberType;
          }
          return matchedGroup;
        });
      }
      return result;
    })
    .catch(
      /* istanbul ignore next */ (err: any): void => {
        throw Error(
          `failure determining membership of ${session.username} in group:${
            requestOptions.groupId
          }: ${err}`
        );
      }
    );
}
