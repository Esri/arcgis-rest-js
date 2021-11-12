/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./add.js";
export * from "./addAttachment.js";
export * from "./addToServiceDefinition.js";
export * from "./applyEdits.js";
export * from "./createFeatureService.js";
export * from "./decodeValues.js";
export * from "./delete.js";
export * from "./deleteAttachments.js";
export * from "./getAllLayersAndTables.js";
export * from "./getAttachments.js";
export * from "./getLayer.js";
export * from "./getService.js";
export * from "./getServiceAdminInfo.js";
export * from "./getViewSources.js";
export * from "./helpers.js";
export * from "./query.js";
export * from "./queryRelated.js";
export * from "./update.js";
export * from "./updateAttachment.js";
export * from "./updateServiceDefinition.js";

// Types that are used in this package are re-exported for convenience and 
// to make the links work correctly in the documentation pages.
export type {
  IFeature,
  ISpatialReference,
  IHasZM,
  GeometryType,
  IField,
  IFeatureSet,
  Units,
  IExtent,
  IGeometry
} from "@esri/arcgis-rest-request";
