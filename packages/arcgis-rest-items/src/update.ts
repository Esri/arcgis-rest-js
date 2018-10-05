/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IItemUpdate } from "@esri/arcgis-rest-common-types";

import {
  IItemCrudRequestOptions,
  IItemMoveResponse,
  IItemResourceRequestOptions,
  IItemUpdateResponse,
  serializeItem,
  determineOwner
} from "./helpers";

export interface IItemUpdateRequestOptions extends IItemCrudRequestOptions {
  item: IItemUpdate;
}

export interface IItemMoveRequestOptions extends IItemCrudRequestOptions {
  /**
   * Alphanumeric id of item to be moved.
   */
  itemId: string;
  /**
   * Alphanumeric id of folder to house moved item. If null, empty, or "/", the destination is the
   * root folder.
   */
  folderId?: string;
}

/**
 * Update an Item
 *
 * * ```js
 * import { updateItem } from '@esri/arcgis-rest-items';
 *
 * updateItem({
 *   authentication: userSession,
 *   item: {
 *     id: "3ef",
 *     description: "A three hour tour"
 *   }
 * })
 * ```
 *
 * @param item - The item to update.
 * @param requestOptions - Options for the request.
 * @returns A Promise that updates an item.
 */
export function updateItem(
  requestOptions: IItemUpdateRequestOptions
): Promise<IItemUpdateResponse> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.item.id
  }/update`;

  // serialize the item into something Portal will accept
  requestOptions.params = {
    ...requestOptions.params,
    ...serializeItem(requestOptions.item)
  };

  return request(url, requestOptions);
}

/**
 * Update a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that updates an item resource.
 */
export function updateItemResource(
  requestOptions: IItemResourceRequestOptions
): Promise<any> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/updateResources`;

  // mix in user supplied params
  requestOptions.params = {
    file: requestOptions.resource,
    fileName: requestOptions.name,
    text: requestOptions.content,
    ...requestOptions.params
  };

  // only override whatever access was specified previously if 'private' was passed explicitly
  if (typeof requestOptions.private !== "undefined") {
    requestOptions.params.access = requestOptions.private
      ? "private"
      : "inherit";
  }

  return request(url, requestOptions);
}

/**
 * Move an item to a folder
 *
 * ```js
 * import { moveItem } from '@esri/arcgis-rest-items';
 *
 * moveItem({
 *   itemId: "3ef",
 *   folderId: "7c5",
 *   authentication: userSession
 * }) ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with owner and folder details once the move has been completed
 */
export function moveItem(
  requestOptions: IItemMoveRequestOptions
): Promise<IItemMoveResponse> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.itemId
  }/move`;

  let folderId = requestOptions.folderId;
  if (!folderId) {
    folderId = "/";
  }
  requestOptions.params = {
    folder: folderId,
    ...requestOptions.params
  };

  return request(url, requestOptions);
}
