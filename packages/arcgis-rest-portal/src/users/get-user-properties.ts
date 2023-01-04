/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url";

export interface IGetUserPropertiesResponse {
  /**
   * user landing page configuration
   */
  landingPage: {
    url: string
  },
  /**
   * user MapViewer configuration
   */
  mapViewer: "classic" | "modern",
  [ key: string ]: unknown
}

/**
 * Helper that returns the properties attribute for a user.
 *
 * @param IGetUserPropertiesOptions - options to pass through in the request
 * @returns User properties object
 */
export async function getUserProperties(username: string, requestOptions?: IRequestOptions): Promise<IGetUserPropertiesResponse> {
  const url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}/properties`;
  const response = await request(url, requestOptions);
  if (!response.mapViewer) {
    response.mapViewer = "modern";
  }
  return response;
}