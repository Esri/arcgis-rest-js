/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IUser } from "@esri/arcgis-rest-common-types";
import { UserSession, IUserRequestOptions } from "@esri/arcgis-rest-auth";

export interface IGetUserRequestOptions extends IUserRequestOptions {
  username?: string;
}

/**
 * Get information about a user
 *
 * ```js
 * import { getUser } from '@esri/arcgis-rest-users';
 *
 * getUser("johnqpublic")
 *   .then(
 *     results => console.log(response); // IUser
 *   )
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metdata about the user
 */
export function getUser(
  requestOptions?: string | IGetUserRequestOptions
): Promise<IUser> {
  let url;
  let options = { httpMethod: "GET" } as IGetUserRequestOptions;

  // if a username is passed, assume ArcGIS Online
  if (typeof requestOptions === "string") {
    url = `http://www.arcgis.com/sharing/rest/community/users/${requestOptions}`;
  } else {
    // if an authenticated session is passed, default to that user/portal unless another username is provided manually
    const username =
      requestOptions.username || requestOptions.authentication.username;
    url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(
      username
    )}`;
    options = {
      ...requestOptions,
      ...options
    };
  }

  // send the request
  return request(url, options);
}
