/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IItemIdRequestOptions, determineOwner } from "./helpers";

/**
 * Protect an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to protect an item.
 */
export function protectItem(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/protect`;
  return request(url, requestOptions);
}

/**
 * Unprotect an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export function unprotectItem(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/unprotect`;
  return request(url, requestOptions);
}
