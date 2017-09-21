/**
 * Spatial reference systems define mathematical transformations and coordinate systems for displaying spatial information in 2D and 3D.
 */
export interface ISpatialReference {
  wkid: number;
  latestWkid?: number;
}

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
 * A simple point geometry, with spatial reference defined.
 */
export interface IPoint {
  x: number;
  y: number;
  spatialReference?: ISpatialReference;
}
