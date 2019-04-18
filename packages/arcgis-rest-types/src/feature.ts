/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGeometry, IHasZM, ISpatialReference, GeometryType } from "./geometry";
import { ISymbol } from "./symbol";
import { IField } from "./webmap";

/**
 * a spatial entity and its corresponding properties
 */
export interface IFeature {
  geometry?: IGeometry;
  attributes: { [key: string]: any };
  symbol?: ISymbol;
}

/**
 *
 */
export interface IFeatureSet extends IHasZM {
  objectIdFieldName?: string; // optional
  globalIdFieldName?: string; // optional
  displayFieldName?: string; // optional
  geometryType?: GeometryType; // for feature layers only
  spatialReference?: ISpatialReference; // for feature layers only.
  fields?: IField[];
  features: IFeature[];
}
