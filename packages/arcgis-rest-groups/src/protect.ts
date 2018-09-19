/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IGroupIdRequestOptions } from "./helpers";

/**
 * Protect a Group. This simply means a user must unprotect the group prior to deleting it
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function protectGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/protect`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}

/**
 * Unprotect a Group.
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function unprotectGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/unprotect`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}
