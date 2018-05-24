/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { UserSession } from "@esri/arcgis-rest-auth";

export interface ISetAccessRequestOptions extends IRequestOptions {
  /**
   * Item identifier
   */
  id: string;
  /**
   * Item owner, if different from the authenticated user.
   */
  owner?: string;
  /**
   * "private" indicates that the item can only be accessed by the user. "public" means accessible to anyone. An item shared to the organization has an access level of "org".
   */
  access: "private" | "public" | "org";
  authentication?: UserSession;
}

export interface ISharingResponse {
  notSharedWith: string[];
  itemId: string;
}
/**
 * Generic method for sharing stuff.
 *
 * ```js
 * import { setAccess } from '@esri/arcgis-rest-sharing';
 *
 * setItemAccess({
 *   id: "abc123",
 *   access: "public",
 *   authentication: session
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
export function setAccess(
  requestOptions: ISetAccessRequestOptions
): Promise<ISharingResponse> {
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;
  const sharingUrl = `${getPortalUrl(
    requestOptions
  )}/content/users/${encodeURIComponent(owner)}/items/${
    requestOptions.id
  }/share`;
  const usernameUrl = `${getPortalUrl(
    requestOptions
  )}/community/users/${encodeURIComponent(username)}`;

  if (owner !== username) {
    // more manual than calling out to "@esri/arcgis-rest-users, but one less dependency
    return request(usernameUrl, {
      authentication: requestOptions.authentication
    }).then(response => {
      if (!response.role || response.role !== "org_admin") {
        throw Error(
          `This item can not be shared by ${username}. They are neither the item owner nor an organization admin.`
        );
      } else {
        return updateAccess(sharingUrl, requestOptions);
      }
    });
  } else {
    return updateAccess(sharingUrl, requestOptions);
  }
}

function updateAccess(
  url: string,
  requestOptions: ISetAccessRequestOptions
): Promise<any> {
  requestOptions.params = {
    org: false,
    everyone: false,
    ...requestOptions.params
  };

  // FYI: i think we're setting 'items' unnecessarily in: https://github.com/Esri/ember-arcgis-portal-services/blob/master/addon/services/sharing-service.js#L26

  if (requestOptions.access === "org") {
    requestOptions.params.org = true;
    requestOptions.params.everyone = false;
  }
  if (requestOptions.access === "public") {
    requestOptions.params.org = true;
    requestOptions.params.everyone = true;
  }
  if (requestOptions.access === "private") {
    requestOptions.params.groups = " ";
  }

  return request(url, requestOptions);
}
