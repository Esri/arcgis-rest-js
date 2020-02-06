/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 *
 */
export const enum SymbolType {
  SLS = "esriSLS",
  SMS = "esriSMS",
  SFS = "esriSFS",
  PMS = "esriPMS",
  PFS = "esriPFS",
  TS = "esriTS"
}

/**
 *
 */
export type Color = [number, number, number, number];

/**
 *
 */
export const enum FontStyle {
  Italic = "italic",
  Normal = "normal",
  Oblique = "oblique"
}

/**
 *
 */
export const enum FontWeight {
  Bold = "bold",
  Bolder = "bolder",
  Lighter = "lighter",
  Normal = "normal"
}

/**
 *
 */
export const enum FontDecoration {
  LineThrough = "line-through",
  Underline = "underline",
  None = "none"
}

/**
 *
 */
export interface IFont {
  family?: string; // "<fontFamily>";
  size?: number; // <fontSize>;
  style?: FontStyle;
  weight?: FontWeight;
  decoration?: FontDecoration;
}

/**
 *
 */
export interface IPictureSourced {
  url?: string; // Relative URL for static layers and full URL for dynamic layers. Access relative URL using http://<mapservice-url>/<layerId1>/images/<imageUrl11>
  imageData?: string; // "<base64EncodedImageData>";
  contentType?: string;
  width?: number;
  height?: number;
  angle?: number;
  xoffset?: number;
  yoffset?: number;
}

/**
 *
 */
export interface ISymbol {
  type: SymbolType;
  style?: string;
}

/**
 *
 */
export interface ISymbol {
  type: SymbolType;
  style?: string;
}

/**
 *
 */
export interface IMarkerSymbol extends ISymbol {
  angle?: number;
  xoffset?: number;
  yoffset?: number;
}

/**
 *
 */
export interface IPictureFillSymbol extends ISymbol, IPictureSourced {
  type: SymbolType.PFS;
  outline?: ISimpleLineSymbol; // if outline has been specified
  xscale?: number;
  yscale?: number;
}

/**
 *
 */
export interface IPictureMarkerSymbol extends IMarkerSymbol, IPictureSourced {
  type: SymbolType.PMS;
}

/**
 *
 */
export const enum SimpleMarkerSymbolStyle {
  Circle = "esriSMSCircle",
  Cross = "esriSMSCross",
  Diamond = "esriSMSDiamond",
  Square = "esriSMSSquare",
  X = "esriSMSX",
  Triangle = "esriSMSTriangle"
}

/**
 *
 */
export const enum SimpleLineSymbolStyle {
  Dash = "esriSLSDash",
  DashDot = "esriSLSDashDot",
  DashDotDot = "esriSLSDashDotDot",
  Dot = "esriSLSDot",
  Null = "esriSLSNull",
  Solid = "esriSLSSolid"
}

/**
 *
 */
export const enum SimpleFillSymbolStyle {
  BackwardDiagonal = "esriSFSBackwardDiagonal",
  Cross = "esriSFSCross",
  DiagonalCross = "esriSFSDiagonalCross",
  ForwardDiagonal = "esriSFSForwardDiagonal",
  Horizontal = "esriSFSHorizontal",
  Null = "esriSFSNull",
  Solid = "esriSFSSolid",
  Vertical = "esriSFSVertical"
}

/**
 *
 */
export interface ISimpleFillSymbol extends ISymbol {
  type: SymbolType.SFS;
  style?: SimpleFillSymbolStyle;
  color?: Color;
  outline?: ISimpleLineSymbol; // if outline has been specified
}

/**
 *
 */
export interface ISimpleLineSymbol extends ISymbol {
  type: SymbolType.SLS;
  style?: SimpleLineSymbolStyle;
  color?: Color;
  width?: number;
}

/**
 *
 */
export interface ISimpleMarkerSymbol extends IMarkerSymbol {
  type: SymbolType.SMS;
  style?: SimpleMarkerSymbolStyle;
  color?: Color;
  size?: number;
  outline?: ISimpleLineSymbol;
}

/**
 *
 */
export interface ITextSymbol extends IMarkerSymbol {
  type: SymbolType.TS;
  color?: Color;
  backgroundColor?: Color;
  borderLineSize?: number; // <size>;
  borderLineColor?: Color;
  haloSize?: number; // <size>;
  haloColor?: Color;
  verticalAlignment?: "baseline" | "top" | "middle" | "bottom";
  horizontalAlignment?: "left" | "right" | "center" | "justify";
  rightToLeft?: boolean;
  kerning?: boolean;
  font?: IFont;
  text?: string; // only applicable when specified as a client-side graphic.
}
