/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 *
 */
export interface IHasZM {
  hasZ?: boolean;
  hasM?: boolean;
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
 * a building block for discrete geometries
 */
export interface IGeometry {
  spatialReference?: ISpatialReference;
}

/**
 * A simple point geometry, with spatial reference defined.
 */
export interface IPoint extends IHasZM, IGeometry {
  x: number;
  y: number;
  z?: number;
}

/**
 *
 */
export interface ILocation {
  latitude?: number;
  longitude?: number;
  lat?: number;
  long?: number;
  z?: number;
}

/**
 * A simple point geometry, with spatial reference defined.
 */
export interface IPoint extends IHasZM, IGeometry {
  x: number;
  y: number;
  z?: number;
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
export type ElipticArc = IArc;

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
export type GeometryType =  // why is this type camelCased?
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
  zmin?: number;
  xmax: number;
  ymax: number;
  zmax?: number;
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
 * A multipoint contains an array of points.
 */
export interface IMultipoint extends IHasZM, IGeometry {
  points: Position[];
}

export type esriUnits =
  | "esriSRUnit_Meter"
  | "esriSRUnit_StatuteMile"
  | "esriSRUnit_Foot"
  | "esriSRUnit_Kilometer"
  | "esriSRUnit_NauticalMile"
  | "esriSRUnit_USNauticalMile";
