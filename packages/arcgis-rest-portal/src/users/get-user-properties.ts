/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url";
import { IGetUserOptions } from "./get-user";

export interface IGetUserPropertiesResponse {
  /**
   * user MapViewer configuration
   */
  mapViewer: string;
}

/**
 * Helper that returns the properties attribute for a user.
 *
 * @param IGetUserOptions - options to pass through in the request
 * @returns User properties object
 */
export function getUserProperties(requestOptions: IGetUserOptions): Promise<IGetUserPropertiesResponse> {
  const username =
    requestOptions.username || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}/properties`;

  return request(url, requestOptions);
}
