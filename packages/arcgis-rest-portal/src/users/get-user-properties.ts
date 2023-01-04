/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url";
import { UserSession } from "@esri/arcgis-rest-auth";

export interface IGetUserPropertiesOptions extends IRequestOptions {
  /**
   * A session representing a logged in user.
   */
  authentication?: UserSession;
  /**
   * Supply a username if you'd like to fetch information about a different user than is being used to authenticate the request.
   */
  username?: string;
}

export interface IGetUserPropertiesResponse {
  /**
   * user landing page configuration
   */
  landingPage: {
    url: string
  }
  /**
   * user MapViewer configuration
   */
  mapViewer: "classic" | "modern"
}

/**
 * Helper that returns the properties attribute for a user.
 *
 * @param IGetUserPropertiesOptions - options to pass through in the request
 * @returns User properties object
 */
export function getUserProperties(requestOptions: IGetUserPropertiesOptions): Promise<IGetUserPropertiesResponse> {
  const username =
    requestOptions.username || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}/properties`;

  return request(url, requestOptions);
}
