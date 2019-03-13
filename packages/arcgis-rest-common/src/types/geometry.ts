/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
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
