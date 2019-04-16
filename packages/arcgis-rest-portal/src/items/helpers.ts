/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IRequestOptions,
  IItemAdd,
  IItemUpdate,
  IItem
} from "@esri/arcgis-rest-request";
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

export interface IFolderIdRequestOptions extends IUserRequestOptions {
  /**
   * Unique identifier of the folder.
   */
  folderId: string;
  /**
   * Item owner username. If not present, `authentication.username` is utilized.
   */
  owner?: string;
}

export type ItemRelationshipType =
  | "Map2Service"
  | "WMA2Code"
  | "Map2FeatureCollection"
  | "MobileApp2Code"
  | "Service2Data"
  | "Service2Service"
  | "Map2AppConfig"
  | "Item2Attachment"
  | "Item2Report"
  | "Listed2Provisioned"
  | "Style2Style"
  | "Service2Style"
  | "Survey2Service"
  | "Survey2Data"
  | "Service2Route"
  | "Area2Package"
  | "Map2Area"
  | "Service2Layer"
  | "Area2CustomPackage";

export interface IItemRelationshipRequestOptions extends IRequestOptions {
  /**
   * Id of the item.
   */
  id: string;
  /**
   * The type of relationship between the two items.
   */
  relationshipType: ItemRelationshipType | ItemRelationshipType[];
  /**
   * The direction of the relationship. Either forward (from origin -> destination) or reverse (from destination -> origin).
   */
  direction?: "forward" | "reverse";
}

export interface IManageItemRelationshipRequestOptions
  extends IUserRequestOptions {
  originItemId: string;
  destinationItemId: string;
  relationshipType: ItemRelationshipType;
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
  /**
   * Object to store
   */
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
  folderId?: string;
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
 * Serialize an item and its data into a json format accepted by the Portal API for create and update operations
 *
 * @param item Item to be serialized
 * @returns a formatted json object to be sent to Portal
 */
export function serializeItem(item: IItemAdd | IItemUpdate | IItem): any {
  // create a clone so we're not messing with the original
  const clone = JSON.parse(JSON.stringify(item));

  // convert .data to .text
  if (clone.data) {
    clone.text = clone.data;
    delete clone.data;
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
