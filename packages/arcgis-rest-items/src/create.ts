import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IItemAdd } from "@esri/arcgis-rest-common-types";

import {
  IItemAddResponse,
  IItemCrudRequestOptions,
  serializeItem,
  determineOwner
} from "./helpers";

export interface IItemAddRequestOptions extends IItemCrudRequestOptions {
  item: IItemAdd;
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
 *     type: "Webmap"
 *   }
 * })
 * ```
 *
 * @param requestOptions - Options for the request
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
