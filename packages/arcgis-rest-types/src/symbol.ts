/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 *
 */
export type Color = [number, number, number, number];

/**
 *
 */
const FontStyle = {
  Italic: "italic",
  Normal: "normal",
  Oblique: "oblique"
} as const;

export type FontStyle = (typeof FontStyle)[keyof typeof FontStyle];

/**
 *
 */
const FontWeight = {
  Bold: "bold",
  Bolder: "bolder",
  Lighter: "lighter",
  Normal: "normal"
} as const;

export type FontWeight = (typeof FontWeight)[keyof typeof FontWeight];

/**
 *
 */
const FontDecoration = {
  LineThrough: "line-through",
  Underline: "underline",
  None: "none"
} as const;

export type FontDecoration = (typeof FontDecoration)[keyof typeof FontDecoration];

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
const SymbolType = {
  SLS: "esriSLS",
  SMS: "esriSMS",
  SFS: "esriSFS",
  PMS: "esriPMS",
  PFS: "esriPFS",
  TS: "esriTS"
} as const;

export type SymbolType = (typeof SymbolType)[keyof typeof SymbolType];

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
const SimpleMarkerSymbolStyle = {
  Circle: "esriSMSCircle",
  Cross: "esriSMSCross",
  Diamond: "esriSMSDiamond",
  Square: "esriSMSSquare",
  X: "esriSMSX",
  Triangle: "esriSMSTriangle"
} as const;

export type SimpleMarkerSymbolStyle = (typeof SimpleMarkerSymbolStyle)[keyof typeof SimpleMarkerSymbolStyle];

/**
 *
 */
const SimpleLineSymbolStyle = {
  Dash: "esriSLSDash",
  DashDot: "esriSLSDashDot",
  DashDotDot: "esriSLSDashDotDot",
  Dot: "esriSLSDot",
  Null: "esriSLSNull",
  Solid: "esriSLSSolid"
} as const;

export type SimpleLineSymbolStyle = (typeof SimpleLineSymbolStyle)[keyof typeof SimpleLineSymbolStyle];

/**
 *
 */
const SimpleFillSymbolStyle = {
  BackwardDiagonal: "esriSFSBackwardDiagonal",
  Cross: "esriSFSCross",
  DiagonalCross: "esriSFSDiagonalCross",
  ForwardDiagonal: "esriSFSForwardDiagonal",
  Horizontal: "esriSFSHorizontal",
  Null: "esriSFSNull",
  Solid: "esriSFSSolid",
  Vertical: "esriSFSVertical"
} as const;

export type SimpleFillSymbolStyle = (typeof SimpleFillSymbolStyle)[keyof typeof SimpleFillSymbolStyle];

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
const VerticalAlignment = {
  Baseline: "baseline",
  Top: "top",
  Middle: "middle",
  Bottom: "bottom"
} as const;

export type VerticalAlignment = (typeof VerticalAlignment)[keyof typeof VerticalAlignment];

const HorizontalAlignment = {
  Left: "left",
  Right: "right",
  Center: "center",
  Justify: "justify"
} as const;

export type HorizontalAlignment = (typeof HorizontalAlignment)[keyof typeof HorizontalAlignment];

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
  verticalAlignment?: VerticalAlignment;
  horizontalAlignment?: HorizontalAlignment;
  rightToLeft?: boolean;
  kerning?: boolean;
  font?: IFont;
  text?: string; // only applicable when specified as a client-side graphic.
}
