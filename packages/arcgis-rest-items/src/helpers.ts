/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";

import { IItemAdd, IItemUpdate, IItem } from "@esri/arcgis-rest-common-types";

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

export interface IItemRequestOptions extends IUserRequestOptions {
  item: IItem;
}

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

export interface IItemResourceRequestOptions extends IItemIdRequestOptions {
  /**
   * New resource filename.
   */
  name?: string;
  /**
   * Text input to be added as a file resource.
   */
  content?: string;
  /**
   * Controls whether access to the file resource is restricted to the owner or inherited from the sharing permissions set for the associated item.
   */
  private?: boolean;
  resource?: any;
}

export interface IItemCrudRequestOptions extends IUserRequestOptions {
  /**
   * The owner of the item. If this property is not present, `item.owner` will be passed, or lastly `authentication.username`.
   */
  owner?: string;
  /**
   * Id of the folder to house the item.
   */
  folder?: string;
}

export interface IItemDataRequestOptions extends IRequestOptions {
  /**
   * Used to request binary data.
   */
  file?: boolean;
}

export interface IItemUpdateResponse {
  success: boolean;
  id: string;
}

export interface IItemAddResponse extends IItemUpdateResponse {
  folder: string;
}

export interface IItemResourceResponse {
  success: boolean;
  itemId: string;
  owner: string;
  folder: string;
}

export interface IAddFolderResponse {
  /**
   * Success or failure of request.
   */
  success: boolean;
  /**
   * Information about created folder: its alphanumeric id, name, and owner's name.
   */
  folder: {
    id: string;
    title: string;
    username: string;
  };
}

export interface IItemMoveResponse {
  /**
   * Success or failure of request.
   */
  success: boolean;
  /**
   * Alphanumeric id of moved item.
   */
  itemId: string;
  /**
   * Name of owner of item.
   */
  owner: string;
  /**
   * Alphanumeric id of folder now housing item.
   */
  folder: string;
}

/**
 * Serialize an item into a json format accepted by the Portal API
 * for create and update operations
 *
 * @param item Item to be serialized
 * @returns a formatted json object to be sent to Portal
 */
export function serializeItem(item: IItemAdd | IItemUpdate | IItem): any {
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

/**
 * requestOptions.owner is given priority, requestOptions.item.owner will be checked next. If neither are present, authentication.username will be assumed.
 */
export function determineOwner(requestOptions: any): string {
  if (requestOptions.owner) {
    return requestOptions.owner;
  }
  if (requestOptions.item && requestOptions.item.owner) {
    return requestOptions.item.owner;
  } else {
    return requestOptions.authentication.username;
  }
}
