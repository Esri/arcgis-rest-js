/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { UserSession } from "@esri/arcgis-rest-auth";

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

export function isItemOwner(requestOptions: ISharingRequestOptions): boolean {
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;
  return owner === username;
}

export function isAdmin(
  requestOptions: ISharingRequestOptions
): Promise<boolean> {
  // more manual than calling out to "@esri/arcgis-rest-users, but one less dependency
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
