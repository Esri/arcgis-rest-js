/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import {
  IItemIdRequestOptions,
  IItemResourceRequestOptions,
  IFolderIdRequestOptions,
  determineOwner
} from "./helpers";

/**
 * ```js
 * import { removeItem } from '@esri/arcgis-rest-items';
 * //
 * removeItem({
 *   id: "3ef",
 *   authentication
 * })
 * ```
 * Delete an item from the portal. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-item.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item.
 */
export function removeItem(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/delete`;
  return request(url, requestOptions);
}

/**
 * Remove a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item resource.
 */
export function removeItemResource(
  requestOptions: IItemResourceRequestOptions
): Promise<any> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/removeResources`;

  // mix in user supplied params
  requestOptions.params = {
    ...requestOptions.params,
    resource: requestOptions.resource
  };
  return request(url, requestOptions);
}

/**
 * Delete a non-root folder. See the [REST
 * Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-folder.htm) for
 * more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes a folder
 */
export function removeFolder(
  requestOptions: IFolderIdRequestOptions
): Promise<any> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/${
    requestOptions.folderId
  }/delete`;
  return request(url, requestOptions);
}
