/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IUser } from "@esri/arcgis-rest-types";

import { UserSession } from "@esri/arcgis-rest-auth";

import { getPortalUrl } from "../util/get-portal-url";

export interface IUpdateUserRequestOptions extends IRequestOptions {
  /**
   * A session representing a logged in user.
   */
  authentication: UserSession;
  /**
   * The user properties to be updated.
   */
  user: IUser;
}

export interface IUpdateUserResponse {
  success: boolean;
  username: string;
}

/**
 * ```js
 * import { updateUser } from '@esri/arcgis-rest-users';
 * // any user can update their own profile
 * updateUser({
 *   authentication,
 *   user: { description: "better than the last one" }
 * })
 *   .then(response)
 * // org administrators must declare the username that will be updated explicitly
 * updateUser({
 *   authentication,
 *   user: { username: "c@sey", description: "" }
 * })
 *   .then(response)
 * // => { "success": true, "username": "c@sey" }
 * ```
 * Update a user profile. The username will be extracted from the authentication session unless it is provided explicitly. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-user.htm) for more information.
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metadata about the user
 */
export function updateUser(
  requestOptions?: IUpdateUserRequestOptions
): Promise<IUpdateUserResponse> {
  // default to the authenticated username unless another username is provided manually
  const username =
    requestOptions.user.username || requestOptions.authentication.username;

  const updateUrl = `${getPortalUrl(
    requestOptions
  )}/community/users/${encodeURIComponent(username)}/update`;

  // mixin custom params and the user information, then drop the user info
  requestOptions.params = {
    ...requestOptions.user,
    ...requestOptions.params
  };

  delete requestOptions.user;

  // send the request
  return request(updateUrl, requestOptions);
}
