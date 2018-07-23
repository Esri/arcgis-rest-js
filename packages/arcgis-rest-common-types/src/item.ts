/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ISpatialReference } from "./index";

/**
 * A Portal [Item](https://developers.arcgis.com/rest/users-groups-and-items/common-parameters.htm) that has not been created yet.
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
 */
export interface IItemUpdate {
  id: string;
  [key: string]: any;
}

/**
 * Existing Portal [Item](https://developers.arcgis.com/rest/users-groups-and-items/item.htm).
 */
export interface IItem extends IItemAdd {
  id: string;
  owner: string;
  tags: string[];
  created: number;
  modified: number;
  protected: boolean;
}
