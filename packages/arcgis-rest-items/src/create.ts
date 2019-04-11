/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IItemAdd } from "@esri/arcgis-rest-common-types";

import {
  IAddFolderResponse,
  IItemAddResponse,
  IItemCrudRequestOptions,
  serializeItem,
  determineOwner
} from "./helpers";

export interface IAddFolderRequestOptions extends IItemCrudRequestOptions {
  /**
   * Name of the folder to create.
   */
  title: string;
}

export interface IItemAddRequestOptions extends IItemCrudRequestOptions {
  item: IItemAdd;
}

/**
 * ```js
 * import { createFolder } from '@esri/arcgis-rest-items';
 * //
 * createFolder({
 *   title: 'Map Collection',
 *   authentication: userSession
 * })
 *   .then(response)
 * ```
 * Create a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/create-folder.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with folder details once the folder has been created
 */
export function createFolder(
  requestOptions: IAddFolderRequestOptions
): Promise<IAddFolderResponse> {
  const owner = determineOwner(requestOptions);

  const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
  const url = `${baseUrl}/createFolder`;

  requestOptions.params = {
    title: requestOptions.title,
    ...requestOptions.params
  };

  return request(url, requestOptions);
}

/**
 * ```js
 * import { createItemInFolder } from '@esri/arcgis-rest-items';
 * //
 * createItem({
 *   item: {
 *     title: "The Amazing Voyage",
 *     type: "Web Map",
 *     data: {}
 *   },
 *   folderId: 'fe8',
 *   authentication
 * })
 * ```
 * Create an item in a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item.htm) for more information.
 *
 * @param requestOptions = Options for the request
 */
export function createItemInFolder(
  requestOptions: IItemAddRequestOptions
): Promise<IItemAddResponse> {
  const owner = determineOwner(requestOptions);

  const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
  let url = `${baseUrl}/addItem`;

  if (requestOptions.folderId) {
    url = `${baseUrl}/${requestOptions.folderId}/addItem`;
  }

  // serialize the item into something Portal will accept
  requestOptions.params = {
    ...requestOptions.params,
    ...serializeItem(requestOptions.item)
  };

  return request(url, requestOptions);
}

/**
 * ```js
 * import { createItem } from '@esri/arcgis-rest-items';
 * //
 * createItem({
 *   item: {
 *     title: "The Amazing Voyage",
 *     type: "Web Map",
 *     data: {}
 *   },
 *   authentication
 * })
 * ```
 * Create an Item in the user's root folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that creates an item.
 */
export function createItem(
  requestOptions: IItemAddRequestOptions
): Promise<IItemAddResponse> {
  // delegate to createItemInFolder placing in the root of the filestore
  const options = {
    folderId: null,
    ...requestOptions
  } as IItemAddRequestOptions;
  return createItemInFolder(options);
}
