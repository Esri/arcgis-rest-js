export * from "./create.js";
export * from "./addTo.js";
export * from "./update.js";
export * from "./get-service-admin-info.js";
export * from "./get-view-sources.js";
export * from "./helpers.js";

// Types that are used in this package are re-exported for convenience and 
// to make the links work correctly in the documentation pages.
export type {
  IFeatureServiceDefinition,
  IExtent,
  ISpatialReference,
  ILayerDefinition,
  ITable
} from "@esri/arcgis-rest-request";
