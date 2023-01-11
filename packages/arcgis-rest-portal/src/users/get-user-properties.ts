/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IRequestOptions,
  IUserRequestOptions,
  request
} from "@esri/arcgis-rest-request";
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
 * Helper that returns the properties attribute for a user.
 *
 * @param IGetUserPropertiesOptions - options to pass through in the request
 * @returns User properties object
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

export async function setUserProperties(
  properties: IUserProperties,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const username = requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/community/users/${encodeURIComponent(username)}/setProperties`;
  const options: IRequestOptions = {
    httpMethod: "POST",
    params: { properties },
    ...requestOptions
  };
  try {
    const response = await request(url, options);
    if (!response.success) {
      throw new Error("Success was false");
    }
    return response;
  } catch (e) {
    const error = e as Error;
    throw new Error(`Failed to set user properties: ${error.message}`);
  }
}
