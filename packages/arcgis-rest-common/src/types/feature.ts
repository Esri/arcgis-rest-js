/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGeometry } from "./geometry";
import { ISymbol } from "./symbol";

/**
 * a spatial entity and its corresponding properties
 */
export interface IFeature {
  geometry?: IGeometry;
  attributes: { [key: string]: any };
  symbol?: ISymbol;
}
