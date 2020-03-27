/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url";
import { IUserItemOptions, determineOwner } from "./helpers";

/**
 * Protect an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/protect.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to protect an item.
 */
export function protectItem(
  requestOptions: IUserItemOptions
): Promise<{ success: boolean }> {
  return determineOwner(requestOptions).then(owner => {
    const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
      requestOptions.id
    }/protect`;
    return request(url, requestOptions);
  });
}

/**
 * Unprotect an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/unprotect.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export function unprotectItem(
  requestOptions: IUserItemOptions
): Promise<{ success: boolean }> {
  return determineOwner(requestOptions).then(owner => {
    const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
      requestOptions.id
    }/unprotect`;
    return request(url, requestOptions);
  });
}
