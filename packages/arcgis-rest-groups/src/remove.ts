/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IGroupIdRequestOptions } from "./helpers";

/**
 * Delete a group.
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function removeGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/delete`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}
