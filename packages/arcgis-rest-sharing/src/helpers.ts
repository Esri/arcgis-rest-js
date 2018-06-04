/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl,
  IParams
} from "@esri/arcgis-rest-request";

import { UserSession } from "@esri/arcgis-rest-auth";

import { IGroupSharingRequestOptions } from "./group-sharing";

export interface ISharingRequestOptions extends IRequestOptions {
  /**
   * Item identifier
   */
  id: string;
  /**
   * Item owner, if different from the authenticated user.
   */
  owner?: string;
  authentication?: UserSession;
}

export interface ISharingResponse {
  notSharedWith?: string[];
  notUnsharedFrom?: string[];
  itemId: string;
}

interface IUserInfo {
  role?: string;
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

  return session.getUserInfo().then(userInfo => {
    if (!userInfo || !userInfo.role || userInfo.role !== "org_admin") {
      return false;
    } else {
      return true;
    }
  });
}

export function getUserMembership(
  requestOptions: IGroupSharingRequestOptions
): Promise<string> {
  let result = "nonmember";
  const username = requestOptions.authentication.username;

  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.groupId
  }/users?f=json`;

  return request(url, { authentication: requestOptions.authentication })
    .then((response: any) => {
      // check if username is in the admin hash...
      if (response.owner === username) {
        result = "owner";
      }
      if (response.admins.includes(username)) {
        result = "admin";
      }
      if (response.users.includes(username)) {
        result = "user";
      }
      return result;
    })
    .catch(
      /* istanbul ignore next */ err => {
        throw Error(
          `failure determining membership of ${username} in group:${
            requestOptions.groupId
          }: ${err}`
        );
      }
    );
}
