/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGeometry, IHasZM, ISpatialReference, GeometryType } from "./geometry";
import { ISymbol } from "./symbol";
import { IField } from "./webmap";

/**
 * a spatial entity and its corresponding properties
 *
 * `IFeature` can also be imported from the following packages:
 *
 * ```js
 * import { IFeature } from "@esri/arcgis-rest-feature-layer";
 * import { IFeature } from "@esri/arcgis-rest-routing";
 * ```
 */
export interface IFeature {
  geometry?: IGeometry;
  attributes: { [key: string]: any };
  symbol?: ISymbol;
}

/**
 * `IFeatureSet` can also be imported from the following packages:
 *
 * ```js
 * import { IFeatureSet } from "@esri/arcgis-rest-feature-layer";
 * ```
 */
export interface IFeatureSet extends IHasZM {
  objectIdFieldName?: string; // optional
  globalIdFieldName?: string; // optional
  displayFieldName?: string; // optional
  geometryType?: GeometryType; // for feature layers only
  spatialReference?: ISpatialReference; // for feature layers only.
  fields?: IField[];
  features: IFeature[];
  fieldAliases?: {
    [key: string]: string
  }
}
