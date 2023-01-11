/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { IUserProperties } from "./get-user-properties.js";

/**
 * Updates the properties for a user
 * @param username The user whose properties to update
 * @param properties IUserProperties object with properties to update
 * @param requestOptions An IRequestOptions object
 * @returns a promise that resolves to { success: boolean }
 */
export async function setUserProperties(
  username: string,
  properties: IUserProperties,
  requestOptions: IRequestOptions
): Promise<{ success: boolean }> {
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
