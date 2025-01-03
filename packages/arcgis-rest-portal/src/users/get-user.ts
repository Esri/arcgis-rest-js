/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  ArcGISIdentityManager,
  IUser,
  IAuthenticationManager
} from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";
import { determineUsername } from "../util/determine-username.js";

export interface IGetUserOptions extends IRequestOptions {
  /**
   * A session representing a logged in user.
   */
  authentication?: IAuthenticationManager;
  /**
   * Supply a username if you'd like to fetch information about a different user than is being used to authenticate the request.
   */
  username?: string;
}

/**
 * Get information about a user. This method has proven so generically useful that you can also call {@linkcode ArcGISIdentityManager.getUser}.
 *
 * ```js
 * import { getUser } from '@esri/arcgis-rest-portal';
 * //
 * getUser("jsmith")
 *   .then(response)
 * // => { firstName: "John", lastName: "Smith",tags: ["GIS Analyst", "City of Redlands"] }
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metadata about the user
 */
export async function getUser(
  requestOptions?: string | IGetUserOptions
): Promise<IUser> {
  let url;
  let options = { httpMethod: "GET" } as IGetUserOptions;

  // if a username is passed, assume ArcGIS Online
  if (typeof requestOptions === "string") {
    url = `https://www.arcgis.com/sharing/rest/community/users/${requestOptions}`;
  } else {
    // if an authenticated session is passed, default to that user/portal unless another username is provided manually
    const username = await determineUsername(requestOptions);
    url = `${getPortalUrl(requestOptions)}/community/users/${username}`;
    options = {
      ...requestOptions,
      ...options
    };
  }
  // send the request
  return request(url, options);
}
