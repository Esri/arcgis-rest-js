/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { IItemAdd } from "@esri/arcgis-rest-types";

import { getPortalUrl } from "../util/get-portal-url";
import {
  IAddFolderResponse,
  IUpdateItemResponse,
  ICreateUpdateItemOptions,
  serializeItem,
  determineOwner
} from "./helpers";

export interface ICreateFolderOptions extends ICreateUpdateItemOptions {
  /**
   * Name of the folder to create.
   */
  title: string;
}

export interface ICreateItemOptions extends ICreateUpdateItemOptions {
  item: IItemAdd;
}

export interface ICreateItemResponse extends IUpdateItemResponse {
  folder: string;
}

/**
 * ```js
 * import { createFolder } from "@esri/arcgis-rest-portal";
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
  requestOptions: ICreateFolderOptions
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
 * import { createItemInFolder } from "@esri/arcgis-rest-portal";
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
  requestOptions: ICreateItemOptions
): Promise<ICreateItemResponse> {
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
 * import { createItem } from "@esri/arcgis-rest-portal";
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
  requestOptions: ICreateItemOptions
): Promise<ICreateItemResponse> {
  // delegate to createItemInFolder placing in the root of the filestore
  const options = {
    folderId: null,
    ...requestOptions
  } as ICreateItemOptions;
  return createItemInFolder(options);
}
