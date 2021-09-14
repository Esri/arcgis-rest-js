/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./query.js";
export * from "./add.js";
export * from "./update.js";
export * from "./delete.js";
export * from "./applyEdits.js";
export * from "./getAllLayersAndTables.js";
export * from "./getAttachments.js";
export * from "./addAttachment.js";
export * from "./updateAttachment.js";
export * from "./deleteAttachments.js";
export * from "./queryRelated.js";
export * from "./getLayer.js";
export * from "./getService.js";
export * from "./decodeValues.js";
export * from "./helpers.js";
export type {
  IFeature,
  ISpatialReference,
  IHasZM,
  GeometryType,
  IField,
  IFeatureSet,
  Units,
  IExtent,
  SpatialRelationship,
  IGeometry,
  ILayerDefinition,
  IFeatureServiceDefinition
} from "@esri/arcgis-rest-types";
