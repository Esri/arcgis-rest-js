/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ISpatialReference
} from "@esri/arcgis-rest-request";

/**
 * A Portal [Item](https://developers.arcgis.com/rest/users-groups-and-items/common-parameters.htm) that has not been created yet.
 *
 * `IItemAdd` can also be imported from the following packages:
 *
 * ```js
 * import { IItemAdd } from "@esri/arcgis-rest-portal";
 * ```
 */
 export interface IItemAdd {
  title: string;
  type: string;
  owner?: string;
  typeKeywords?: string[];
  description?: string;
  snippet?: string;
  documentation?: string;
  extent?: number[][];
  categories?: string[];
  spatialReference?: ISpatialReference;
  culture?: string;
  properties?: any;
  url?: string;
  tags?: string[];
  [key: string]: any;
}

/**
 * A Portal [Item](https://developers.arcgis.com/rest/users-groups-and-items/common-parameters.htm) to be updated.
 *
 * `IItemUpdate` can also be imported from the following packages:
 *
 * ```js
 * import { IItemUpdate } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IItemUpdate {
  id: string;
  [key: string]: any;
}

/**
 * Existing Portal [Item](https://developers.arcgis.com/rest/users-groups-and-items/item.htm).
 *
 * `IItem` can also be imported from the following packages:
 *
 * ```js
 * import { IItem } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IItem extends IItemAdd {
  id: string;
  owner: string;
  tags: string[];
  created: number;
  modified: number;
  numViews: number;
  size: number;
  protected?: boolean; // not present in search results
}

/**
 * Used for organizing content. See [Create Folder](https://developers.arcgis.com/rest/users-groups-and-items/create-folder.htm) for more details.
 *
 * `IFolder` can also be imported from the following packages:
 *
 * ```js
 * import { IFolder } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IFolder {
  username: string;
  id: string;
  title: string;
  created?: number;
}

/**
 * Params for paging operations
 *
 * `IPagingParams` can also be imported from the following packages:
 *
 * ```js
 * import { IPagingParams } from "@esri/arcgis-rest-portal";
 * ```
 */
 export interface IPagingParams {
  start?: number;
  num?: number;
}
/**
 * Paging properties for paged responses.
 *
 * `IPagedResponse` can also be imported from the following packages:
 *
 * ```js
 * import { IPagedResponse } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IPagedResponse extends IPagingParams {
  /** total number of object across all pages */
  total: number;
  /** next entry index or -1 for the last page */
  nextStart: number;
}

/**
 * Response from the portals/Self/isServiceNameAvailable request
 */
 export interface IServiceNameAvailable {
  available: boolean;
}
