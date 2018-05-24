/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { UserSession } from "@esri/arcgis-rest-auth";

import {
  ISharingRequestOptions,
  ISharingResponse,
  isItemOwner,
  getSharingUrl,
  isAdmin
} from "./helper";

export interface ISetAccessRequestOptions extends ISharingRequestOptions {
  /**
   * "private" indicates that the item can only be accessed by the user. "public" means accessible to anyone. An item shared to the organization has an access level of "org".
   */
  access: "private" | "org" | "public";
}

/**
 * Set access level of an item to 'public', 'org', or 'private'.
 *
 * ```js
 * import { setItemAccess } from '@esri/arcgis-rest-sharing';
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
export function setItemAccess(
  requestOptions: ISetAccessRequestOptions
): Promise<ISharingResponse> {
  const url = getSharingUrl(requestOptions);

  if (isItemOwner(requestOptions)) {
    return isAdmin(requestOptions).then(admin => {
      if (admin) {
        return updateItemAccess(url, requestOptions);
      } else {
        throw Error(
          `This item can not be shared by ${
            requestOptions.authentication.username
          }. They are neither the item owner nor an organization admin.`
        );
      }
    });
  } else {
    return updateItemAccess(url, requestOptions);
  }
}

function updateItemAccess(
  url: string,
  requestOptions: ISetAccessRequestOptions
): Promise<any> {
  requestOptions.params = {
    org: false,
    everyone: false,
    ...requestOptions.params
  };

  if (requestOptions.access === "private") {
    requestOptions.params.groups = " ";
  }
  if (requestOptions.access === "org") {
    requestOptions.params.org = true;
  }
  if (requestOptions.access === "public") {
    requestOptions.params.org = true;
    requestOptions.params.everyone = true;
  }
  return request(url, requestOptions);
}
