/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./query";
export * from "./add";
export * from "./update";
export * from "./delete";
export * from "./applyEdits";
export * from "./getAttachments";
export * from "./addAttachment";
export * from "./updateAttachment";
export * from "./deleteAttachments";
export * from "./queryRelated";
export * from "./getLayer";
export * from "./getService";
export * from "./decodeValues";
export * from "./helpers";
export {
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
  IFeatureServiceDefinition,
} from "@esri/arcgis-rest-types";
