/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { getPortalUrl } from "../util/get-portal-url";
import { IUserProperties } from "./get-user-properties";

/**
 * Updates the properties for a user
 * @param username The user whose properties to update
 * @param properties IUserProperties object with properties to update
 * @param requestOptions An IUserRequestOptions object
 * @returns a promise that resolves to { success: boolean }
 */
export async function setUserProperties(username: string, properties: IUserProperties, requestOptions: IUserRequestOptions): Promise<{ success: boolean }> {
  const url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}/setProperties`;
  const options: IUserRequestOptions = {
    httpMethod: 'POST',
    params: { properties },
    ...requestOptions
  };
  try {
    const response = await request(url, options)
    if (!response.success) {
      throw new Error("Success was false");
    }
    return response;
  } catch(e) {
    const error = e as Error;
    throw new Error(`Failed to set user properties: ${error.message}`);
  }
}