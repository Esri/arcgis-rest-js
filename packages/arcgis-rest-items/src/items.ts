/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  IParams,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IExtent, IItem } from "@esri/arcgis-rest-common-types";

import { UserSession } from "@esri/arcgis-rest-auth";

export interface ISearchRequest {
  q: string;
  start?: number;
  num?: number;
  [key: string]: any;
}

export interface ISearchResult {
  query: string; // matches the api's form param
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: IItem[];
}

export interface IUserSessionRequestOptions extends IRequestOptions {
  authentication: UserSession;
}

/**
 * Search for items via the portal api
 *
 * ```js
 * import { searchItems } from '@esri/arcgis-rest-items';
 *
 * searchItems({q:'water'})
 * .then((results) => {
 *  console.log(response.results.total); // 355
 * })
 * ```
 *
 * @param searchForm - Search request
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchItems(
  searchForm: ISearchRequest,
  requestOptions?: IRequestOptions
): Promise<ISearchResult> {
  // construct the search url
  const url = `${getPortalUrl(requestOptions)}/search`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };

  // send the request
  return request(url, searchForm, options);
}

/**
 * Create an item in a folder
 *
 * @param item - item object
 * @param folder - optional folder to create the item in
 * @param requestOptions = Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 */
export function createItemInFolder(
  item: IItem,
  folder: string,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${itemOwner}`;
  let url = `${baseUrl}/addItem`;
  if (folder) {
    url = `${baseUrl}/${folder}/addItem`;
  }
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  // serialize the item into something Portal will accept
  const requestParams = serializeItem(item);

  return request(url, requestParams, options);
}

/**
 * Create an Item in the user's root folder
 *
 * @param item - the item
 * @param requestOptions - Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 */
export function createItem(
  item: IItem,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  // delegate to createItemInFolder placing in the root of the filestore
  return createItemInFolder(item, null, requestOptions, itemOwner);
}

/**
 * Send json to an item to be stored as the `/data` resource
 *
 * @param id - Item Id
 * @param data - Javascript object to store
 * @param requestOptions - Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 */
export function addItemJsonData(
  id: string,
  data: any,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${itemOwner}/items/${id}/update`;

  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  // Portal API requires that the 'data' be stringified and POSTed in
  // a `text` form field. It can also be sent with the `.create` call by sending
  // a `.data` property.
  const requestParams = {
    text: JSON.stringify(data)
  };

  return request(url, requestParams, options);
}
/**
 * Get an item by id
 *
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
export function getItem(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IItem> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}`;
  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, null, options);
}

/**
 * Get the /data for an item.
 * Note: Some items do not return json from /data
 * and this method will throw if that is the case.
 *
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the json data for the item.
 */
export function getItemData(
  id: string,
  requestOptions?: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}/data`;
  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, null, options);
}

/**
 * Update an Item
 *
 * @param item - The item to update.
 * @param requestOptions - Options for the request.
 * @returns A Promise that resolves with the status of the operation.
 */
export function updateItem(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${item.owner}/items/${item.id}/update`;

  // serialize the item into something Portal will accept
  const requestParams = serializeItem(item);

  return request(url, requestParams, requestOptions);
}

/**
 * Remove an item from the portal
 *
 * @param id - guid item id
 * @param requestOptions - Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 * @returns A Promise that deletes an item.
 */
export function removeItem(
  id: string,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${itemOwner}/items/${id}/delete`;
  return request(url, null, requestOptions);
}

/**
 * Protect an item
 *
 * @param id - guid item id
 * @param requestOptions - Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 * @returns A Promise to protect an item.
 */
export function protectItem(
  id: string,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${itemOwner}/items/${id}/protect`;
  return request(url, null, requestOptions);
}

/**
 * Unprotect an item
 *
 * @param id - guid item id
 * @param requestOptions - Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 * @returns A Promise to unprotect an item.
 */
export function unprotectItem(
  id: string,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${itemOwner}/items/${id}/unprotect`;
  return request(url, null, requestOptions);
}

/**
 * Get the resources associated with an item
 *
 * @param id - guid item id
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export function getItemResources(
  id: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}/resources`;

  return request(url, { num: 1000 }, requestOptions);
}

/**
 * Update a resource associated with an item
 *
 * @param id - guid item id
 * @param owner - string owner username
 * @param name - new resource filename
 * @param content - text input to be added as a file resource
 * @param requestOptions - Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 * @returns A Promise to unprotect an item.
 */
export function updateItemResource(
  id: string,
  name: string,
  content: string,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${itemOwner}/items/${id}/updateResources`;

  const params = {
    fileName: name,
    text: content
  };

  return request(url, params, requestOptions);
}

/**
 * Remove a resource associated with an item
 *
 * @param id - guid item id
 * @param resource - guid item id
 * @param requestOptions - Options for the request
 * @param owner - The authentication session typically identifies the item owner, but you can also pass one in explicitly
 * @returns A Promise to unprotect an item.
 */
export function removeItemResource(
  id: string,
  resource: string,
  requestOptions: IUserSessionRequestOptions,
  owner?: string
): Promise<any> {
  const itemOwner = owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${itemOwner}/items/${id}/removeResources`;

  return request(url, { resource }, requestOptions);
}

/**
 * Serialize an item into a json format accepted by the Portal API
 * for create and update operations
 *
 * @param item IItem to be serialized
 * @returns a formatted json object to be sent to Portal
 */
function serializeItem(item: IItem): any {
  // create a clone so we're not messing with the original
  const clone = JSON.parse(JSON.stringify(item));
  // join keywords and tags...
  clone.typeKeywords = item.typeKeywords.join(", ");
  clone.tags = item.tags.join(", ");
  // convert .data to .text
  if (clone.data) {
    clone.text = JSON.stringify(clone.data);
    delete clone.data;
  }
  // Convert properties to a string
  if (clone.properties) {
    clone.properties = JSON.stringify(clone.properties);
  }
  return clone;
}
