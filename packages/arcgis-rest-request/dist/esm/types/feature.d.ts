import { GeometryType, IHasZM, ISpatialReference, IPoint, IPolyline, IPolylineWithCurves, IPolygon, IPolygonWithCurves } from "./geometry.js";
import { IField } from "./service.js";
import { ISymbol } from "./symbol.js";
/**
 * `IFeatureSet` can also be imported from the following packages:
 *
 * ```js
 * import { IFeatureSet } from "@esri/arcgis-rest-feature-service";
 * ```
 */
export interface IFeatureSet extends IHasZM {
    objectIdFieldName?: string;
    globalIdFieldName?: string;
    displayFieldName?: string;
    geometryType?: GeometryType;
    spatialReference?: ISpatialReference;
    fields?: IField[];
    features: IFeature[];
    fieldAliases?: {
        [key: string]: string;
    };
}
/**
 * A spatial entity and its corresponding properties
 *
 * `IFeature` can also be imported from the following packages:
 *
 * ```js
 * import { IFeature } from "@esri/arcgis-rest-feature-service";
 * import { IFeature } from "@esri/arcgis-rest-routing";
 * ```
 */
export interface IFeature {
    geometry?: IPoint | IPolyline | IPolylineWithCurves | IPolygon | IPolygonWithCurves;
    attributes: {
        [key: string]: any;
    };
    symbol?: ISymbol;
}
