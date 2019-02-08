/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IItemUpdate } from "@esri/arcgis-rest-common-types";

import {
  IItemCrudRequestOptions,
  IItemMoveResponse,
  IItemResourceRequestOptions,
  IItemUpdateInfoRequestOptions,
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
 * ```js
 * import { updateItem } from '@esri/arcgis-rest-items';
 * //
 * updateItem({
 *   item: {
 *     id: "3ef",
 *     description: "A three hour tour"
 *   },
 *   authentication
 * })
 *   .then(response)
 * ```
 * Update an Item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-item.htm) for more information.
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
 * ```js
 * import { updateItemResource } from '@esri/arcgis-rest-items';
 * //
 * updateItemResource({
 *   id: '3ef',
 *   resource: file,
 *   name: 'bigkahuna.jpg',
 *   authentication
 * })
 *   .then(response)
 * ```
 * Update a resource associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-resources.htm) for more information.
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
 * ```js
 * import { updateItemInfo } from '@esri/arcgis-rest-items';
 * //
 * updateItemInfo({
 *   id: '3ef',
 *   content: {name: 'Darth Vader', children: ['Luke', 'Leia']}
 *   fileName: 'seekret.json'
 *   authentication
 * })
 *   .then(response) // --> {success:true|false}
 * ```
 * Add an info file associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-info.htm) for more information.
 *
 * Valid File types: JSON, XML, CFG, TXT, PBF, and PNG
 * Max File Size: 100K
 *
 * @param requestOptions  Options for the request
 * @returns A Promise that add/updates an item info.
 */
export function updateItemInfo(
  requestOptions: IItemUpdateInfoRequestOptions
): Promise<any> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/updateInfo`;

  // mix in user supplied params
  requestOptions.params = {
    fileName: requestOptions.name,
    ...requestOptions.params
  };

  // if we were passed a blob, use it
  if (typeof Blob !== "undefined" && requestOptions.content instanceof Blob) {
    requestOptions.params.file = requestOptions.content;
  } else {
    // since we love developers, we also allow sending an object, and handling
    // the blobification here...
    if (typeof requestOptions.content === "object") {
      requestOptions.params.file = new Blob(
        [JSON.stringify(requestOptions.content)],
        { type: "application/json" }
      );
    } else {
      // finally, we also accept text which we
      // treat as string, but get the type from the filename extention...
      const ext = requestOptions.name.split(".")[1] || "txt";
      let type = "plain";
      if (ext === "xml") {
        type = "xml";
      }
      requestOptions.params.file = new Blob([requestOptions.content], {
        type: `text/${type}`
      });
    }
  }

  return request(url, requestOptions);
}

/**
 * ```js
 * import { moveItem } from '@esri/arcgis-rest-items';
 * //
 * moveItem({
 *   itemId: "3ef",
 *   folderId: "7c5",
 *   authentication: userSession
 * })
 * ```
 * Move an item to a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/move-item.htm) for more information.
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
