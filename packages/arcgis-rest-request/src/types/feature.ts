/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  GeometryType,
  IHasZM,
  ISpatialReference,
  IGeometry
} from "./geometry.js";
import { IField } from "./service.js";
import { ISymbol } from "./symbol.js";

/**
 * `IFeatureSet` can also be imported from the following packages:
 *
 * ```js
 * import { IFeatureSet } from "@esri/arcgis-rest-feature-service";
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
    [key: string]: string;
  };
}

/**
 * A spatial entity and its corresponding properties
 *
 * `IFeature` can also be imported from the following packages:
 *
 * ```js
 * import { IFeature } from "@esri/arcgis-rest-feature-service";
 * import { IFeature } from "@esri/arcgis-rest-routing";
 * ```
 */
export interface IFeature {
  geometry?: IGeometry;
  attributes: { [key: string]: any };
  symbol?: ISymbol;
}
