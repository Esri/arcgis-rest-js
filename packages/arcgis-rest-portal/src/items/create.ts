/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, appendCustomParams, IItemAdd } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";
import {
  IAddFolderResponse,
  IUpdateItemResponse,
  ICreateUpdateItemOptions,
  determineOwner
} from "./helpers.js";

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
  return determineOwner(requestOptions).then((owner) => {
    const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
    const url = `${baseUrl}/createFolder`;

    requestOptions.params = {
      title: requestOptions.title,
      ...requestOptions.params
    };

    return request(url, requestOptions);
  });
}

/**
 * ```js
 * import { createItemInFolder } from "@esri/arcgis-rest-portal";
 * //
 * createItemInFolder({
 *   item: {
 *     title: "The Amazing Voyage",
 *     type: "Web Map"
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
  if (requestOptions.multipart && !requestOptions.filename) {
    return Promise.reject(
      new Error("The filename is required for a multipart request.")
    );
  }

  return determineOwner(requestOptions).then((owner) => {
    const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
    let url = `${baseUrl}/addItem`;

    if (requestOptions.folderId) {
      url = `${baseUrl}/${requestOptions.folderId}/addItem`;
    }

    requestOptions.params = {
      ...requestOptions.params,
      ...requestOptions.item
    };

    // serialize the item into something Portal will accept
    const options = appendCustomParams<ICreateItemOptions>(
      requestOptions,
      [
        "owner",
        "folderId",
        "file",
        "dataUrl",
        "text",
        "async",
        "multipart",
        "filename",
        "overwrite"
      ],
      {
        params: { ...requestOptions.params }
      }
    );

    return request(url, options);
  });
}

/**
 * ```js
 * import { createItem } from "@esri/arcgis-rest-portal";
 * //
 * createItem({
 *   item: {
 *     title: "The Amazing Voyage",
 *     type: "Web Map"
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
