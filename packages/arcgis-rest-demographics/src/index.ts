/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./getAvailableCountries.js";
export * from "./getAvailableDataCollections.js";
export * from "./getAvailableGeographyLevels.js";
export * from "./getGeography.js";
export * from "./queryDemographicData.js";

// Types that are used in this package are re-exported for convenience and
// to make the links work correctly in the documentation pages.
export type {
  IRequestOptions,
  IFeatureSet,
  IExtent
} from "@esri/arcgis-rest-request";
