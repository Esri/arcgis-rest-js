/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./solveRoute.js";
export * from "./closestFacility.js";
export * from "./serviceArea.js";
export * from "./originDestinationMatrix.js";
export * from "./helpers.js";

// Types that are used in this package are re-exported for convenience and 
// to make the links work correctly in the documentation pages.
export type {
  IRequestOptions,
  ILocation,
  IPoint,
  IPolyline,
  Position2D,
  IFeatureSet,
  IFeature
} from "@esri/arcgis-rest-request";