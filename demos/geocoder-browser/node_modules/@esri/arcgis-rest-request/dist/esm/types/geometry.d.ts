/**
 * `IHasZM` can also be imported from the following packages:
 *
 * ```js
 * import { IHasZM } from "@esri/arcgis-rest-feature-service";
 * ```
 */
export interface IHasZM {
    hasZ?: boolean;
    hasM?: boolean;
}
/**
 * Spatial reference systems define mathematical transformations and coordinate systems for displaying spatial information in 2D and 3D.
 *
 * `ISpatialReference` can also be imported from the following packages:
 *
 * ```js
 * import { ISpatialReference } from "@esri/arcgis-rest-geocoding";
 * import { ISpatialReference } from "@esri/arcgis-rest-service-admin";
 * import { ISpatialReference } from "@esri/arcgis-rest-feature-service";
 * ```
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
 *
 * `IGeometry` can also be imported from the following packages:
 *
 * ```js
 * import { IGeometry } from "@esri/arcgis-rest-feature-service";
 * ```
 */
export interface IGeometry {
    spatialReference?: ISpatialReference;
}
/**
 * A simple point geometry, with spatial reference defined.
 *
 * `IPoint` can also be imported from the following packages:
 *
 * ```js
 * import { IPoint } from "@esri/arcgis-rest-routing";
 * import { IPoint } from "@esri/arcgis-rest-geocoding";
 * ```
 */
export interface IPoint extends IHasZM, IGeometry {
    x: number;
    y: number;
    z?: number;
}
/**
 * `ILocation` can also be imported from the following packages:
 *
 * ```js
 * import { ILocation } from "@esri/arcgis-rest-routing";
 * import { ILocation } from "@esri/arcgis-rest-geocoding";
 * ```
 */
export interface ILocation {
    latitude?: number;
    longitude?: number;
    lat?: number;
    long?: number;
    z?: number;
}
/**
 * A polyline geometry.
 *
 * `IPolyLine` can also be imported from the following packages:
 *
 * ```
 * import { IPolyLine } from "@esri/arcgis-rest-routing";
 * ```
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
export declare type Position = Position2D | [number, number, number] | [number, number, number, number];
/**
 * `Position2D` can also be imported from the following packages:
 *
 * ```
 * import { Position2D } from "@esri/arcgis-rest-routing";
 * ```
 */
export declare type Position2D = [number, number];
/**
 * An arc can be represented as a JSON curve object
 */
export interface IArc {
    a: [
        Position,
        Position2D,
        number,
        number,
        number,
        number,
        number
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
export declare type ElipticArc = IArc;
/**
 * `GeometryType` can also be imported from the following packages:
 *
 * ```js
 * import { GeometryType } from "@esri/arcgis-rest-feature-service";
 * ```
 */
export declare type GeometryType = "esriGeometryPoint" | "esriGeometryMultipoint" | "esriGeometryPolyline" | "esriGeometryPolygon" | "esriGeometryEnvelope";
/**
 * Extents are used to define rectangles and bounding boxes.
 *
 * `IExtent` can also be imported from the following packages:
 *
 * ```js
 * import { IExtent } from "@esri/arcgis-rest-demographics";
 * import { IExtent } from "@esri/arcgis-rest-feature-service";
 * import { IExtent } from "@esri/arcgis-rest-geocoding";
 * import { IExtent } from "@esri/arcgis-rest-service-admin";
 * ```
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
export declare type JsonCurve = ICircularArc | IArc | IOldCircularArc | IBezierCurve;
/**
 *
 */
export interface IOldCircularArc {
    a: [
        Position,
        Position2D,
        number,
        number
    ];
}
/**
 * A multipoint contains an array of points.
 */
export interface IMultipoint extends IHasZM, IGeometry {
    points: Position[];
}
/**
 * `Units` can also be imported from the following packages:
 *
 * ```js
 * import { Units } from "@esri/arcgis-rest-feature-service";
 * ```
 */
export declare type Units = "esriSRUnit_Meter" | "esriSRUnit_StatuteMile" | "esriSRUnit_Foot" | "esriSRUnit_Kilometer" | "esriSRUnit_NauticalMile" | "esriSRUnit_USNauticalMile";
