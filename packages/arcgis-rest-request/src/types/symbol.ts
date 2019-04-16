/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 *
 */
export type Color = [number, number, number, number];

/**
 *
 */
export interface IFont {
  family?: string; // "<fontFamily>";
  size?: number; // <fontSize>;
  style?: "italic" | "normal" | "oblique";
  weight?: "bold" | "bolder" | "lighter" | "normal";
  decoration?: "line-through" | "underline" | "none";
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
  type: "esriPFS";
  outline?: ISimpleLineSymbol; // if outline has been specified
  xscale?: number;
  yscale?: number;
}

/**
 *
 */
export interface IPictureMarkerSymbol extends IMarkerSymbol, IPictureSourced {
  type: "esriPMS";
}

/**
 *
 */
export type SimpleMarkerSymbolStyle =
  | "esriSMSCircle"
  | "esriSMSCross"
  | "esriSMSDiamond"
  | "esriSMSSquare"
  | "esriSMSX"
  | "esriSMSTriangle";

/**
 *
 */
export type SimpleLineSymbolStyle =
  | "esriSLSDash"
  | "esriSLSDashDot"
  | "esriSLSDashDotDot"
  | "esriSLSDot"
  | "esriSLSNull"
  | "esriSLSSolid";

/**
 *
 */
export type SimpleFillSymbolStyle =
  | "esriSFSBackwardDiagonal"
  | "esriSFSCross"
  | "esriSFSDiagonalCross"
  | "esriSFSForwardDiagonal"
  | "esriSFSHorizontal"
  | "esriSFSNull"
  | "esriSFSSolid"
  | "esriSFSVertical";

/**
 *
 */
export type SymbolType =
  | "esriSLS"
  | "esriSMS"
  | "esriSFS"
  | "esriPMS"
  | "esriPFS"
  | "esriTS";

/**
 *
 */
export interface ISimpleFillSymbol extends ISymbol {
  type: "esriSFS";
  style?: SimpleFillSymbolStyle;
  color?: Color;
  outline?: ISimpleLineSymbol; // if outline has been specified
}

/**
 *
 */
export interface ISimpleLineSymbol extends ISymbol {
  type: "esriSLS";
  style?: SimpleLineSymbolStyle;
  color?: Color;
  width?: number;
}

/**
 *
 */
export interface ISimpleMarkerSymbol extends IMarkerSymbol {
  type: "esriSMS";
  style?: SimpleMarkerSymbolStyle;
  color?: Color;
  size?: number;
  outline?: ISimpleLineSymbol;
}

/**
 *
 */
export interface ITextSymbol extends IMarkerSymbol {
  type: "esriTS";
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
