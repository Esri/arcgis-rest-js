/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGroup } from "./group";

export * from "./webmap";
export * from "./item";
export * from "./group";

/**
 * an arc can be represented as a JSON curve object
 */
export interface IArc {
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
export interface IBezierCurve {
  b: [Position, Position2D, Position2D];
}

/**
 * a circular arc can be represented as a JSON curve object
 */
export interface ICircularArc {
  c: [Position, Position2D];
}

/**
 *
 */
export type Color = [number, number, number, number];

/**
 *
 */
export type ElipticArc = IArc;

/**
 * a spatial entity and its corresponding properties
 */
export interface IFeature {
  geometry?: IGeometry;
  attributes: { [key: string]: any };
  symbol?: ISymbol;
}

/**
 * Field type.
 */
export type esriFieldType =
  | "esriFieldTypeBlob"
  | "esriFieldTypeDate"
  | "esriFieldTypeDouble"
  | "esriFieldTypeGeometry"
  | "esriFieldTypeGlobalID"
  | "esriFieldTypeGUID"
  | "esriFieldTypeInteger"
  | "esriFieldTypeOID"
  | "esriFieldTypeRaster"
  | "esriFieldTypeSingle"
  | "esriFieldTypeSmallInteger"
  | "esriFieldTypeString"
  | "esriFieldTypeXML";

/**
 * Contains information about an attribute field.
 */
export interface IField {
  /** A string defining the field name. */
  name: string;
  /** A string defining the field type. */
  type: esriFieldType;
  /** A string defining the field alias. */
  alias?: string;
  /** The domain objects if applicable. */
  domain?: any;
  /** A Boolean defining whether this field is editable. */
  editable?: boolean;
  /** A Boolean defining whether or not the field is an exact match. */
  exactMatch?: boolean;
  /** A number defining how many characters are allowed in a string. field. */
  length?: number;
  /** A Boolean defining whether this field can have a null value. */
  nullable?: boolean;
}

/**
 * a building block for discrete geometries
 */
export interface IGeometry {
  spatialReference?: ISpatialReference;
}

/**
 * An envelope is a rectangle defined by a range of values for each coordinate and attribute.
 */
export interface IEnvelope extends IGeometry {
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
export type esriGeometryType =  // why is this type camelCased?
  | "esriGeometryPoint"
  | "esriGeometryMultipoint"
  | "esriGeometryPolyline"
  | "esriGeometryPolygon"
  | "esriGeometryEnvelope";

/**
 * The spatial relationship used to compare input geometries
 */
export type SpatialRelationship =
  | "esriSpatialRelIntersects"
  | "esriSpatialRelContains"
  | "esriSpatialRelCrosses"
  | "esriSpatialRelEnvelopeIntersects"
  | "esriSpatialRelIndexIntersects"
  | "esriSpatialRelOverlaps"
  | "esriSpatialRelTouches"
  | "esriSpatialRelWithin";

/**
 * Extents are used to define rectangles and bounding boxes.
 */
export interface IExtent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference?: ISpatialReference;
}

/**
 *
 */
export interface IHasZM {
  hasZ?: boolean;
  hasM?: boolean;
}

/**
 *
 */
export interface IFeatureSet extends IHasZM {
  objectIdFieldName?: string; // optional
  globalIdFieldName?: string; // optional
  displayFieldName?: string; // optional
  geometryType?: esriGeometryType; // for feature layers only
  spatialReference?: ISpatialReference; // for feature layers only.
  fields?: IField[];
  features: IFeature[];
}

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
export type JsonCurve = ICircularArc | IArc | IOldCircularArc | IBezierCurve;

/**
 *
 */
export interface IOldCircularArc {
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
 * A multipoint contains an array of points.
 */
export interface IMultipoint extends IHasZM, IGeometry {
  points: Position[];
}

/**
 * Params for paging operations
 */
export interface IPagingParams {
  start?: number;
  num?: number;
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
 * A simple point geometry, with spatial reference defined.
 */
export interface IPoint extends IHasZM, IGeometry {
  x: number;
  y: number;
}

/**
 *
 */
export interface IPolyline extends IHasZM, IGeometry {
  paths: Position[][];
}

/**
 *
 */
export interface IPolylineWithCurves extends IHasZM, IGeometry {
  curvePaths: Array<Array<Position | JsonCurve>>;
}

/**
 *
 */
export interface IPolygon extends IHasZM, IGeometry {
  rings: Position[][];
}

/**
 *
 */
export interface IPolygonWithCurves extends IHasZM, IGeometry {
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
 * Spatial reference systems define mathematical transformations and coordinate systems for displaying spatial information in 2D and 3D.
 */
export interface ISpatialReference {
  wkid?: number;
  latestWkid?: number;
  vcsWkid?: number;
  latestVcsWkid?: number;
  wkt?: string;
  latestWkt?: string;
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

/**
 * An ArcGIS Online or Enterprise user
 */
export interface IUser {
  username?: string;
  fullName?: string;
  availableCredits?: number;
  assignedCredits?: number;
  firstName?: string;
  lastName?: string;
  preferredView?: any;
  description?: string;
  email?: string;
  idpUsername?: string;
  favGroupId?: string;
  lastLogin?: number;
  mfaEnabled?: boolean;
  access?: string;
  storageUsage?: number;
  storageQuota?: number;
  orgId?: string;
  role?: "org_admin" | "org_publisher" | "org_user";
  privileges?: string[];
  roleId?: string;
  level?: string;
  disabled?: boolean;
  units?: string;
  tags?: string[];
  culture?: string;
  region?: string;
  thumbnail?: string;
  created?: number;
  modified?: number;
  groups?: IGroup[];
  provider?: "arcgis" | "enterprise" | "facebook" | "google";
}

export type esriUnits =
  | "esriSRUnit_Meter"
  | "esriSRUnit_StatuteMile"
  | "esriSRUnit_Foot"
  | "esriSRUnit_Kilometer"
  | "esriSRUnit_NauticalMile"
  | "esriSRUnit_USNauticalMile";
