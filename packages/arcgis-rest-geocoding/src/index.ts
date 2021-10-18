/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./geocode.js";
export * from "./suggest.js";
export * from "./reverse.js";
export * from "./bulk.js";
export * from "./helpers.js";

// Types that are used in this package are re-exported for convenience and 
// to make the links work correctly in the documentation pages.
export type {
  IPoint,
  ILocation,
  IExtent,
  ISpatialReference
} from "@esri/arcgis-rest-request";
