/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IItem, IPagingParams } from "@esri/arcgis-rest-common-types";

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

export interface IItemRequestOptions extends IUserRequestOptions {
  item: IItem;
}

// * @param id - Item Id
// * @param owner - Item owner username
// * @param data - Javascript object to store

export interface IItemIdRequestOptions extends IUserRequestOptions {
  /**
   * Unique identifier of the item.
   */
  id: string;
  /**
   * Item owner username. If not present, `authentication.username` is utilized.
   */
  owner?: string;
}

export interface IItemJsonDataRequestOptions extends IItemIdRequestOptions {
  /**
   * JSON object to store
   */
  data: any;
}

export interface IItemResourceRequestOptions extends IItemIdRequestOptions {
  /**
   * New resource filename.
   */
  name?: string;
  /**
   * Text input to be added as a file resource.
   */
  content?: string;
  resource?: string;
}

export interface IItemCrudRequestOptions extends IUserRequestOptions {
  item: IItem;
  /**
   * The owner of the item. If this property is not present, `item.owner` will be passed, or lastly `authentication.username`.
   */
  owner?: string;
  /**
   * Folder to house the item.
   */
  folder?: string;
}

export interface IItemShareRequestOptions extends IItemIdRequestOptions {
  /**
   * A comma-separated list of group IDs with which the item will be shared.
   */
  groups?: string;
  /**
   * If `true`, this item will be shared with everyone, for example, it will be publicly accessible. If explicitly set to false, the item will not be shared with the public.
   */
  everyone?: boolean;
  /**
   * If `true`, this item will be shared with the organization. If set to false, the item will not be shared with the organization.
   */
  org?: boolean;
  /**
   * Set to `true` when the item will be shared with groups with item update capability so that any member of such groups can update the item that is shared with them.
   */
  confirmItemControl?: boolean;
}

// this interface still needs to be docced
export interface ISearchRequest extends IPagingParams {
  q: string;
  [key: string]: any;
  // start: number;
  // num: number;
}

export interface ISearchRequestOptions extends IRequestOptions {
  searchForm?: ISearchRequest;
}

/**
 * Options to pass through when searching for items.
 */
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
 * searchItems('water')
 * .then((results) => {
 *  console.log(response.results.total); // 355
 * })
 * ```
 *
 * @param search - A string or RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchItems(
  search: string | ISearchRequestOptions
): Promise<ISearchResult> {
  let options: ISearchRequestOptions = {
    httpMethod: "GET",
    params: {}
  };

  if (typeof search === "string") {
    options.params.q = search;
  } else {
    options.params = search.searchForm;
    // mixin, giving user supplied requestOptions precedence
    options = {
      ...options,
      ...search
    };
  }

  // construct the search url
  const url = `${getPortalUrl(options)}/search`;

  // send the request
  return request(url, options);
}

/**
 * Create an item in a folder
 *
 * @param requestOptions = Options for the request
 */
export function createItemInFolder(
  requestOptions: IItemCrudRequestOptions
): Promise<any> {
  const owner =
    requestOptions.owner ||
    requestOptions.item.owner ||
    requestOptions.authentication.username;
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
 * @param requestOptions - Options for the request
 */
export function createItem(
  requestOptions: IItemCrudRequestOptions
): Promise<any> {
  // delegate to createItemInFolder placing in the root of the filestore
  const options = {
    folder: null,
    ...requestOptions
  } as IItemCrudRequestOptions;
  return createItemInFolder(options);
}

/**
 * Send json to an item to be stored as the `/data` resource
 *
 * @param requestOptions - Options for the request
 */
export function addItemJsonData(
  requestOptions: IItemJsonDataRequestOptions
): Promise<any> {
  const owner = requestOptions.owner || requestOptions.authentication.username;

  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/update`;

  // Portal API requires that the 'data' be stringified and POSTed in
  // a `text` form field. It can also be sent with the `.create` call by sending
  // a `.data` property.
  requestOptions.params = {
    ...requestOptions.params,
    text: JSON.stringify(requestOptions.data)
  };

  return request(url, requestOptions);
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
  return request(url, options);
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
  return request(url, options);
}

/**
 * Update an Item
 *
 * @param item - The item to update.
 * @param requestOptions - Options for the request.
 * @returns A Promise that resolves with the status of the operation.
 */
export function updateItem(requestOptions: IItemRequestOptions): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/users/${
    requestOptions.item.owner
  }/items/${requestOptions.item.id}/update`;

  // serialize the item into something Portal will accept
  requestOptions.params = {
    ...requestOptions.params,
    ...serializeItem(requestOptions.item)
  };

  return request(url, requestOptions);
}

/**
 * Remove an item from the portal
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that deletes an item.
 */
export function removeItem(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const owner = requestOptions.owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/delete`;
  return request(url, requestOptions);
}

/**
 * Protect an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to protect an item.
 */
export function protectItem(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const owner = requestOptions.owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/protect`;
  return request(url, requestOptions);
}

/**
 * Unprotect an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export function unprotectItem(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const owner = requestOptions.owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/unprotect`;
  return request(url, requestOptions);
}

/**
 * Get the resources associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
export function getItemResources(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${
    requestOptions.id
  }/resources`;

  // mix in user supplied params
  requestOptions.params = {
    ...requestOptions.params,
    num: 1000
  };

  return request(url, requestOptions);
}

/**
 * Update a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export function updateItemResource(
  requestOptions: IItemResourceRequestOptions
): Promise<any> {
  const owner = requestOptions.owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/updateResources`;

  // mix in user supplied params
  requestOptions.params = {
    ...requestOptions.params,
    fileName: requestOptions.name,
    text: requestOptions.content
  };

  return request(url, requestOptions);
}

/**
 * Remove a resource associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export function removeItemResource(
  requestOptions: IItemResourceRequestOptions
): Promise<any> {
  const owner = requestOptions.owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/removeResources`;

  // mix in user supplied params
  requestOptions.params = {
    ...requestOptions.params,
    resource: requestOptions.resource
  };
  return request(url, requestOptions);
}

/**
 * Share an item as the item owner
 * @param requestOptions - Options for the request
 * @return A Promise to share an item
 */
export function shareItem(
  requestOptions: IItemShareRequestOptions
): Promise<any> {
  const owner = requestOptions.owner || requestOptions.authentication.username;
  const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
    requestOptions.id
  }/share`;

  // this is a POST only API
  requestOptions.httpMethod = "POST";

  return request(url, requestOptions);
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
  const { typeKeywords = [], tags = [] } = item;
  clone.typeKeywords = typeKeywords.join(", ");
  clone.tags = tags.join(", ");
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
