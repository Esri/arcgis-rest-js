/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IItemAdd, IItemUpdate, IItem } from "@esri/arcgis-rest-types";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Base options interface for making authenticated requests for items.
 */
export interface IUserItemOptions extends IUserRequestOptions {
  /**
   * Unique identifier of the item.
   */
  id: string;
  /**
   * Item owner username. If not present, `authentication.username` is utilized.
   */
  owner?: string;
}

export interface IFolderIdOptions extends IUserRequestOptions {
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
  | "Area2CustomPackage"
  | "TrackView2Map"
  | "SurveyAddIn2Data";

export interface IItemRelationshipOptions extends IRequestOptions {
  /**
   * Unique identifier of the item.
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

export interface IManageItemRelationshipOptions extends IUserRequestOptions {
  originItemId: string;
  destinationItemId: string;
  relationshipType: ItemRelationshipType;
}

export interface IItemInfoOptions extends IUserItemOptions {
  /**
   * Subfolder for added information.
   */
  folderName?: string;
  /**
   * Object to store
   */
  file: any;
}

export interface IItemResourceOptions extends IUserItemOptions {
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

export interface ICreateUpdateItemOptions extends IUserRequestOptions {
  /**
   * The owner of the item. If this property is not present, `item.owner` will be passed, or lastly `authentication.username`.
   */
  owner?: string;
  /**
   * Id of the folder to house the item.
   */
  folderId?: string;
  /**
   * The file to be uploaded. If uploading a file, the request must be a multipart request.
   */
  file?: any;
  /**
   * The URL where the item can be downloaded. The resource will be downloaded and stored as a file type. Similar to uploading a file to be added, but instead of transferring the contents of the file, the URL of the data file is referenced and creates a file item.
   */
  dataUrl?: string;
  /**
   * The text content for the item to be submitted.
   */
  text?: string;
  /**
   * If true, the file is uploaded asynchronously. If false, the file is uploaded synchronously.
   */
  async?: boolean;
  /**
   * If true, the file is uploaded in multiple parts.
   */
  multipart?: boolean;
  /**
   * The filename being uploaded in multipart mode. Required if multipart=true.
   */
  filename?: string;
  /**
   * If true, overwrite the existing file.
   */
  overwrite?: boolean;
}

export interface IItemDataOptions extends IRequestOptions {
  /**
   * Used to request binary data.
   */
  file?: boolean;
}

export interface IItemPartOptions extends IUserItemOptions {
  /**
   * The file part to be uploaded.
   */
  file: any;
  /**
   * Part numbers can be any number from 1 to 10,000, inclusive. A part number uniquely identifies a part and also defines its position within the object being created. If you upload a new part using the same part number that was used with a previous part, the previously uploaded part is overwritten.
   */
  partNum: number;
}

export interface IUpdateItemResponse {
  success: boolean;
  id: string;
}

export interface IItemInfoResponse {
  success: boolean;
  itemId: string;
  owner: string;
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

export interface IMoveItemResponse {
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

  // binary data needs POSTed as a `file`
  // JSON object literals should be passed as `text`.
  if (clone.data) {
    (typeof Blob !== "undefined" && item.data instanceof Blob) ||
    // Node.js doesn't implement Blob
    item.data.constructor.name === "ReadStream"
      ? (clone.file = item.data)
      : (clone.text = item.data);
    delete clone.data;
  }
  return clone;
}

/**
 * `requestOptions.owner` is given priority, `requestOptions.item.owner` will be checked next. If neither are present, `authentication.getUserName()` will be used instead.
 */
export function determineOwner(requestOptions: any): Promise<string> {
  if (requestOptions.owner) {
    return Promise.resolve(requestOptions.owner);
  } else if (requestOptions.item && requestOptions.item.owner) {
    return Promise.resolve(requestOptions.item.owner);
  } else if (requestOptions.authentication) {
    return requestOptions.authentication.getUsername();
  } else {
    return Promise.reject(
      new Error(
        "Could not determine the owner of this item. Pass the `owner`, `item.owner`, or `authentication` option."
      )
    );
  }
}
