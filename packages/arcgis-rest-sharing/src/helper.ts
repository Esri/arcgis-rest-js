/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  getPortalUrl
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
  notSharedWith: string[];
  itemId: string;
}

export function getSharingUrl(requestOptions: ISharingRequestOptions): string {
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;
  return `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(
    owner
  )}/items/${requestOptions.id}/share`;
}

export function getOwner(requestOptions: ISharingRequestOptions): string {
  return requestOptions.owner || requestOptions.authentication.username;
}

export function isItemOwner(requestOptions: ISharingRequestOptions): boolean {
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;
  return owner === username;
}

export function isAdmin(
  requestOptions: ISharingRequestOptions
): Promise<boolean> {
  // more manual than calling out to "@esri/arcgis-rest-users, but trims a dependency
  const username = requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/community/users/${encodeURIComponent(username)}`;
  return request(url, {
    authentication: requestOptions.authentication
  }).then(response => {
    if (!response.role || response.role !== "org_admin") {
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

  const urlPath = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.groupId
  }/users?f=json`;

  return request(urlPath, { authentication: requestOptions.authentication })
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
    .catch(err => {
      // debug(`GroupService:getUserMembership ${id} for ${username} errored: ${err}`);
      throw Error(
        `GroupService:getUserMembership ${
          requestOptions.id
        } for ${username} errored: ${err}`
      );
    });
}
