/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import {
  IItemIdRequestOptions,
  IItemResourceRequestOptions,
  IItemAddResponse,
  IItemResourceResponse,
  determineOwner
} from "./helpers";

export interface IItemDataAddRequestOptions extends IItemIdRequestOptions {
  /**
   * Object to store
   */
  data: any;
}

export interface IItemResourceAddRequestOptions
  extends IItemResourceRequestOptions {
  /**
   * Object to store
   */
  resource: any;
}

/**
 * Send json to an item to be stored as the `/data` resource
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with an object reporting
 *        success/failure and echoing the item id.
 */
export function addItemJsonData(
  requestOptions: IItemDataAddRequestOptions
): Promise<IItemAddResponse> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/update`;

  // Portal API requires that the 'data' be stringified and POSTed in
  // a `text` form field. It can also be sent with the `.create` call by sending
  // a `.data` property.
  requestOptions.params = {
    text: JSON.stringify(requestOptions.data),
    ...requestOptions.params
  };

  return request(url, requestOptions);
}

/**
 * Send a file or blob to an item to be stored as the `/data` resource
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with an object reporting
 *        success/failure and echoing the item id.
 */
export function addItemData(
  requestOptions: IItemDataAddRequestOptions
): Promise<IItemAddResponse> {
  const owner = determineOwner(requestOptions);

  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/update`;

  // Portal API requires that the 'data' be POSTed in a `file` form field.
  requestOptions.params = {
    file: requestOptions.data,
    ...requestOptions.params
  };

  return request(url, requestOptions);
}

/**
 * Add a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to add item resources.
 */
export function addItemResource(
  requestOptions: IItemResourceAddRequestOptions
): Promise<IItemResourceResponse> {
  const owner = determineOwner(requestOptions);
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/addResources`;

  requestOptions.params = {
    file: requestOptions.resource,
    fileName: requestOptions.name,
    text: requestOptions.content,
    access: requestOptions.private ? "private" : "inherit",
    ...requestOptions.params
  };

  return request(url, requestOptions);
}
