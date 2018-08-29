import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IItemAdd } from "@esri/arcgis-rest-common-types";

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

import {
  IFolderAddResponse,
  IItemAddResponse,
  IItemCrudRequestOptions,
  serializeItem,
  determineOwner
} from "./helpers";

export interface IItemAddRequestOptions extends IItemCrudRequestOptions {
  item: IItemAdd;
}

/**
 * Create a folder
 *
 * ```js
 * import { createFolder } from '@esri/arcgis-rest-items';
 *
 * createFolder("Map Collection", {
 *   authentication: userSession
 * })
 * ```
 *
 * @param folder - Name to be assigned to new folder
 * @param requestOptions - Options for the request
 * @returns A Promise that creates a folder
 */
export function createFolder(
  folderName: string,
  requestOptions: IUserRequestOptions
): Promise<IFolderAddResponse> {
  const owner = determineOwner(requestOptions);

  const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
  const url = `${baseUrl}/createFolder`;

  requestOptions.params = {
    ...requestOptions.params,
    title: folderName
  };

  return request(url, requestOptions);
}

/**
 * Create an item in a folder
 *
 * @param requestOptions = Options for the request
 */
export function createItemInFolder(
  requestOptions: IItemAddRequestOptions
): Promise<IItemAddResponse> {
  const owner = determineOwner(requestOptions);

  const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
  let url = `${baseUrl}/addItem`;

  if (requestOptions.folder) {
    url = `${baseUrl}/${requestOptions.folder}/addItem`;
  }

  // serialize the item into something Portal will accept
  requestOptions.params = {
    ...requestOptions.params,
    ...serializeItem(requestOptions.item)
  };

  return request(url, requestOptions);
}

/**
 * Create an Item in the user's root folder
 *
 * ```js
 * import { createItem } from '@esri/arcgis-rest-items';
 *
 * createItem({
 *   authentication: userSession,
 *   item: {
 *     title: "The Amazing Voyage",
 *     type: "Web Map"
 *   }
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that creates an item.
 */
export function createItem(
  requestOptions: IItemAddRequestOptions
): Promise<IItemAddResponse> {
  // delegate to createItemInFolder placing in the root of the filestore
  const options = {
    folder: null,
    ...requestOptions
  } as IItemAddRequestOptions;
  return createItemInFolder(options);
}
