/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";

export interface IUserProperties {
  /**
   * user landing page configuration
   */
  landingPage: {
    url: string;
  };
  /**
   * user MapViewer configuration
   */
  mapViewer: "classic" | "modern";
  [key: string]: unknown;
}

/**
 * Fetches the properties for a user
 * @param username The user whose properties to fetch
 * @param requestOptions An IRequestOptions object
 * @returns a promise that resolves an IUserProperties object
 */
export async function getUserProperties(
  username: string,
  requestOptions: IRequestOptions
): Promise<IUserProperties> {
  const url = `${getPortalUrl(
    requestOptions
  )}/community/users/${encodeURIComponent(username)}/properties`;
  const response = await request(url, { httpMethod: "GET", ...requestOptions });
  if (!response.properties.mapViewer) {
    response.properties.mapViewer = "modern";
  }
  return response.properties;
}
