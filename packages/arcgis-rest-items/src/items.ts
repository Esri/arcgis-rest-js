/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  IParams,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IExtent, IItem } from "@esri/arcgis-rest-common-types";

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
 * @param owner - owner name
 * @param item - item object
 * @param folder - optional folder to create the item in
 * @param requestOptions = Options for the request
 */
export function createItemInFolder(
  owner: string,
  item: IItem,
  folder: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
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
 * @param owner - owner name
 * @param item - the item
 * @param requestOptions - Options for the request
 */
export function createItem(
  owner: string,
  item: IItem,
  requestOptions: IRequestOptions
): Promise<any> {
  // delegate to createItemInFolder placing in the root of the filestore
  return createItemInFolder(owner, item, null, requestOptions);
}

/**
 * Send json to an item to be stored as the `/data` resource
 * 
 * @param id - Item Id
 * @param owner - Item owner username
 * @param data - Javascript object to store
 * @param requestOptions - Options for the request
 */
export function addItemJsonData(
  id: string,
  owner: string,
  data: any,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${owner}/items/${id}/update`;

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
  requestOptions?: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${item.owner}/items/${item.id}/update`;

  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  // serialize the item into something Portal will accept
  const requestParams = serializeItem(item);

  return request(url, requestParams, options);
}

/**
 * Remove an item from the portal
 * 
 * @param id - guid item id
 * @param owner - string owner username
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item.
 */
export function removeItem(
  id: string,
  owner: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${owner}/items/${id}/delete`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  return request(url, null, options);
}

/**
 * Protect an item
 * 
 * @param id - guid item id
 * @param owner - string owner username
 * @param requestOptions - Options for the request
 * @returns A Promise to protect an item.
 */
export function protectItem(
  id: string,
  owner: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${owner}/items/${id}/protect`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  return request(url, null, options);
}

/**
 * Unprotect an item
 * 
 * @param id - guid item id
 * @param owner - string owner username
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export function unprotectItem(
  id: string,
  owner: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/content/users/${owner}/items/${id}/unprotect`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  return request(url, null, options);
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
