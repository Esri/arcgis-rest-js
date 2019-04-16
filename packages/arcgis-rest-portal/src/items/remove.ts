/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  getPortalUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";
import {
  IItemIdRequestOptions,
  IItemResourceRequestOptions,
  IFolderIdRequestOptions,
  determineOwner,
  IManageItemRelationshipRequestOptions
} from "./helpers";

/**
 * ```js
 * import { removeItem } from "@esri/arcgis-rest-portal";
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
 * ```js
 * import { removeItemRelationship } from "@esri/arcgis-rest-portal";
 * //
 * removeItemRelationship({
 *   originItemId: '3ef',
 *   destinationItemId: 'ae7',
 *   relationshipType: 'Service2Layer',
 *   authentication
 * })
 *   .then(response)
 * ```
 * Remove a relationship between two items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-relationship.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to add item resources.
 */
export function removeItemRelationship(
  requestOptions: IManageItemRelationshipRequestOptions
): Promise<{ success: boolean }> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${owner}/removeRelationship`;

  const options = appendCustomParams<IManageItemRelationshipRequestOptions>(
    requestOptions,
    ["originItemId", "destinationItemId", "relationshipType"],
    { params: { ...requestOptions.params } }
  );

  return request(url, options);
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
 * ```js
 * import { removeFolder } from "@esri/arcgis-rest-portal";
 * //
 * removeFolder({
 *   folderId: "fe4",
 *   owner: "c@sey",
 *   authentication
 * })
 *   .then(response)
 *
 * ```
 * Delete a non-root folder and all the items it contains. See the [REST
 * Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-folder.htm) for
 * more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes a folder
 */
export function removeFolder(
  requestOptions: IFolderIdRequestOptions
): Promise<{
  success: boolean;
  folder: {
    username: string;
    id: string;
    title: string;
  };
}> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${encodeURIComponent(owner)}/${
    requestOptions.folderId
  }/delete`;
  return request(url, requestOptions);
}
