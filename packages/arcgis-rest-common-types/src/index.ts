/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * an arc can be represented as a JSON curve object
 */
export interface Arc {
  a: [
    Position, // End point: x, y, <z>, <m>
    Position2D, // Center point: center_x, center_y
    number, // minor
    number, // clockwise
    number, // rotation
    number, // axis
    number // ratio
  ];
}

/**
 * a bezier curve can be represented as a JSON curve object
 */
export interface BezierCurve {
  b: [Position, Position2D, Position2D];
}

/**
 * a circular arc can be represented as a JSON curve object
 */
export interface CircularArc {
  c: [Position, Position2D];
}

/**
 *
 */
export type Color = [number, number, number, number];

/**
 *
 */
export type ElipticArc = Arc;

/**
 * a spatial entity and its corresponding properties
 */
export interface Feature {
  geometry?: Geometry;
  attributes?: any;
}

/**
 *
 */
export interface Field {
  name: string;
  type: string;
  alias?: string;
  length?: number;
}

/**
 * a building block for discrete geometries
 */
export interface Geometry {
  spatialReference?: SpatialReference;
}

/**
 * An envelope is a rectangle defined by a range of values for each coordinate and attribute.
 */
export interface Envelope extends Geometry {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;

  zmin?: number;
  zmax?: number;

  mmin?: number;
  mmax?: number;
}

/**
 *
 */
export type esriGeometryType =
  | "esriGeometryPoint"
  | "esriGeometryMultipoint"
  | "esriGeometryPolyline"
  | "esriGeometryPolygon"
  | "esriGeometryEnvelope";

/**
 *
 */
export interface FeatureSet extends HasZM {
  objectIdFieldName?: string; // optional
  globalIdFieldName?: string; // optional
  displayFieldName?: string; // optional
  geometryType?: esriGeometryType; // for feature layers only
  spatialReference?: SpatialReference; // for feature layers only.
  fields?: Field[];
  features: Feature[];
}

/**
 *
 */
export interface Font {
  family?: string; // "<fontFamily>";
  size?: number; // <fontSize>;
  style?: "italic" | "normal" | "oblique";
  weight?: "bold" | "bolder" | "lighter" | "normal";
  decoration?: "line-through" | "underline" | "none";
}

/**
 * Extents are used to define rectangles and bounding boxes.
 */
export interface Extent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference?: SpatialReference;
}

/**
 *
 */
export interface HasZM {
  hasZ?: boolean;
  hasM?: boolean;
}

/**
 * Portal Item
 */
export interface Item {
  id?: string;
  owner: string;
  title: string;
  type: string;
  tags: string[];
  typeKeywords: string[];
  description?: string;
  snippet?: string;
  documentation?: string;
  extent?: number[][];
  categories?: string[];
  spatialReference?: any;
  culture?: string;
  properties?: any;
  url?: string;
  [key: string]: any;
}

/**
 *
 */
export type JsonCurve = CircularArc | Arc | OldCircularArc | BezierCurve;

/**
 *
 */
export interface OldCircularArc {
  a: [
    Position, // End point: x, y, <z>, <m>
    Position2D, // Center point: center_x, center_y
    number, // minor
    number // clockwise
  ];
}

/**
 *
 */
export interface MarkerSymbol extends Symbol {
  angle?: number;
  xoffset?: number;
  yoffset?: number;
}

/**
 * A multipoint contains an array of points.
 */
export interface Multipoint extends HasZM, Geometry {
  points: Position[];
}

/**
 * Params for paging operations
 */
export interface PagingParams {
  start?: number;
  num?: number;
}

/**
 *
 */
export interface PictureFillSymbol extends Symbol, PictureSourced {
  type: "esriPFS";
  outline?: SimpleLineSymbol; // if outline has been specified
  xscale?: number;
  yscale?: number;
}

/**
 *
 */
export interface PictureMarkerSymbol extends MarkerSymbol, PictureSourced {
  type: "esriPMS";
}

/**
 *
 */
export interface PictureSourced {
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
 * A simple point geometry, with spatial reference defined.
 */
export interface Point extends HasZM, Geometry {
  x: number;
  y: number;
}

/**
 *
 */
export interface Polyline extends HasZM, Geometry {
  paths: Position[][];
}

/**
 *
 */
export interface PolylineWithCurves extends HasZM, Geometry {
  curvePaths: Array<Array<Position | JsonCurve>>;
}

/**
 *
 */
export interface Polygon extends HasZM, Geometry {
  rings: Position[][];
}

/**
 *
 */
export interface PolygonWithCurves extends HasZM, Geometry {
  curveRings: Array<Array<Position | JsonCurve>>;
}

/**
 *
 */
export type Position =
  | Position2D
  | [number, number, number]
  | [number, number, number, number];

/**
 *
 */
export type Position2D = [number, number];

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
export interface SimpleFillSymbol extends Symbol {
  type: "esriSFS";
  style?: SimpleFillSymbolStyle;
  color?: Color;
  outline?: SimpleLineSymbol; // if outline has been specified
}

/**
 *
 */
export interface SimpleLineSymbol extends Symbol {
  type: "esriSLS";
  style?: SimpleLineSymbolStyle;
  color?: Color;
  width?: number;
}

/**
 *
 */
export interface SimpleMarkerSymbol extends MarkerSymbol {
  type: "esriSMS";
  style?: SimpleMarkerSymbolStyle;
  color?: Color;
  size?: number;
  outline?: SimpleLineSymbol;
}

/**
 * Spatial reference systems define mathematical transformations and coordinate systems for displaying spatial information in 2D and 3D.
 */
export interface SpatialReferenceWkid {
  wkid: number;
  latestWkid?: number;
  vcsWkid?: number;
  latestVcsWkid?: number;
}

/**
 *
 */
export interface SpatialReferenceWkt {
  wkt?: string;
  latestWkt?: string;
}

/**
 *
 */
export type SpatialReference = SpatialReferenceWkt | SpatialReferenceWkid;

/**
 *
 */
export interface Symbol {
  type: SymbolType;
  style?: string;
}

/**
 *
 */
export interface TextSymbol extends MarkerSymbol {
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
  font?: Font;
  text?: string; // only applicable when specified as a client-side graphic.
}
