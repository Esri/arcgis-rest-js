/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItemUpdate } from "@esri/arcgis-rest-types";

import { getPortalUrl } from "../util/get-portal-url";
import {
  ICreateUpdateItemOptions,
  IMoveItemResponse,
  IItemInfoOptions,
  IItemResourceOptions,
  IItemInfoResponse,
  IItemResourceResponse,
  IUpdateItemResponse,
  serializeItem,
  determineOwner
} from "./helpers";

export interface IUpdateItemOptions extends ICreateUpdateItemOptions {
  item: IItemUpdate;
}

export interface IMoveItemOptions extends ICreateUpdateItemOptions {
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
 * import { updateItem } from "@esri/arcgis-rest-portal";
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
 * @param requestOptions - Options for the request.
 * @returns A Promise that updates an item.
 */
export function updateItem(
  requestOptions: IUpdateItemOptions
): Promise<IUpdateItemResponse> {
  return determineOwner(requestOptions).then(owner => {
    const url = requestOptions.folderId
      ? `${getPortalUrl(requestOptions)}/content/users/${owner}/${requestOptions.folderId}/items/${requestOptions.item.id}/update`
      : `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.item.id}/update`;

    // serialize the item into something Portal will accept
    requestOptions.params = {
      ...requestOptions.params,
      ...serializeItem(requestOptions.item)
    };

    return request(url, requestOptions);
  });
}

/**
 * ```js
 * import { updateItemInfo } from "@esri/arcgis-rest-portal";
 * //
 * updateItemInfo({
 *   id: '3ef',
 *   file: file,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Update an info file associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-info.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that updates an item info file.
 */
export function updateItemInfo(
  requestOptions: IItemInfoOptions
): Promise<IItemInfoResponse> {
  return determineOwner(requestOptions).then(owner => {
    const url = `${getPortalUrl(
      requestOptions as IRequestOptions
    )}/content/users/${owner}/items/${requestOptions.id}/updateinfo`;

    // mix in user supplied params
    requestOptions.params = {
      folderName: requestOptions.folderName,
      file: requestOptions.file,
      ...requestOptions.params
    };

    return request(url, requestOptions);
  });
}

/**
 * ```js
 * import { updateItemResource } from "@esri/arcgis-rest-portal";
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
  requestOptions: IItemResourceOptions
): Promise<IItemResourceResponse> {
  return determineOwner(requestOptions).then(owner => {
    const url = `${getPortalUrl(
      requestOptions as IRequestOptions
    )}/content/users/${owner}/items/${requestOptions.id}/updateResources`;

    // mix in user supplied params
    requestOptions.params = {
      file: requestOptions.resource,
      fileName: requestOptions.name,
      resourcesPrefix: requestOptions.prefix,
      text: requestOptions.content,
      ...requestOptions.params
    };

    // only override the access specified previously if 'private' is passed explicitly
    if (typeof requestOptions.private !== "undefined") {
      requestOptions.params.access = requestOptions.private
        ? "private"
        : "inherit";
    }
    return request(url, requestOptions);
  });
}

/**
 * ```js
 * import { moveItem } from "@esri/arcgis-rest-portal";
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
  requestOptions: IMoveItemOptions
): Promise<IMoveItemResponse> {
  return determineOwner(requestOptions).then(owner => {
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
  });
}
