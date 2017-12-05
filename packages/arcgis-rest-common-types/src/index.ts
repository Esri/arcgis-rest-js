/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Spatial reference systems define mathematical transformations and coordinate systems for displaying spatial information in 2D and 3D.
 */
export interface ISpatialReference {
  wkid: number;
  latestWkid?: number;
}

/**
 * Extents are used to define rectangles and bounding boxes.
 */
export interface IExtent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference?: ISpatialReference;
}

/**
 * A simple point geometry, with spatial reference defined.
 */
export interface IPoint {
  x: number;
  y: number;
  spatialReference?: ISpatialReference;
}

/**
 * Params for paging operations
 */
export interface IPagingParams {
  start?: number;
  num?: number;
}

/**
 * Portal Item
 */
export interface IItem {
  id?: string;
  owner: string;
  title: string;
  type: string;
  tags: string[];
  typeKeywords: string[];
  description?: string;
  snippet?: string;
  documentation?: string;
  extent?: number[][];
  categories?: string[];
  spatialReference?: any;
  culture?: string;
  properties?: any;
  url?: string;
  [key: string]: any;
}
