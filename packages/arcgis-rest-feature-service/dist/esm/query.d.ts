import { ISpatialReference, IFeatureSet, IFeature, Units, IExtent } from "@esri/arcgis-rest-request";
import { IGetLayerOptions, ISharedQueryOptions, IStatisticDefinition } from "./helpers.js";
/**
 * Request options to fetch a feature by id.
 */
export interface IGetFeatureOptions extends IGetLayerOptions {
    /**
     * Unique identifier of the feature.
     */
    id: number;
}
/**
 * feature query request options. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 */
export interface IQueryFeaturesOptions extends ISharedQueryOptions {
    objectIds?: number[];
    relationParam?: string;
    time?: number | number[];
    distance?: number;
    units?: Units;
    /**
     * Attribute fields to include in the response. Defaults to "*"
     */
    outFields?: "*" | string[];
    returnGeometry?: boolean;
    maxAllowableOffset?: number;
    geometryPrecision?: number;
    inSR?: string | ISpatialReference;
    outSR?: string | ISpatialReference;
    gdbVersion?: string;
    returnDistinctValues?: boolean;
    returnIdsOnly?: boolean;
    returnCountOnly?: boolean;
    returnExtentOnly?: boolean;
    orderByFields?: string;
    groupByFieldsForStatistics?: string;
    outStatistics?: IStatisticDefinition[];
    returnZ?: boolean;
    returnM?: boolean;
    multipatchOption?: "xyFootprint";
    resultOffset?: number;
    resultRecordCount?: number;
    quantizationParameters?: any;
    returnCentroid?: boolean;
    resultType?: "none" | "standard" | "tile";
    historicMoment?: number;
    returnTrueCurves?: false;
    sqlFormat?: "none" | "standard" | "native";
    returnExceededLimitFeatures?: boolean;
    /**
     * Response format. Defaults to "json"
     * NOTE: for "pbf" you must also supply `rawResponse: true`
     * and parse the response yourself using `response.arrayBuffer()`
     */
    f?: "json" | "geojson" | "pbf";
}
export interface IQueryFeaturesResponse extends IFeatureSet {
    exceededTransferLimit?: boolean;
}
export interface IQueryResponse {
    count?: number;
    extent?: IExtent;
    objectIdFieldName?: string;
    objectIds?: number[];
}
/**
 * Get a feature by id.
 *
 * ```js
 * import { getFeature } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
 *
 * getFeature({
 *   url,
 *   id: 42
 * }).then(feature => {
 *  console.log(feature.attributes.FID); // 42
 * });
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the feature or the [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) itself if `rawResponse: true` was passed in.
 */
export declare function getFeature(requestOptions: IGetFeatureOptions): Promise<IFeature>;
/**
 * Query a feature service. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
 *
 * ```js
 * import { queryFeatures } from '@esri/arcgis-rest-feature-service';
 *
 * queryFeatures({
 *   url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
 *   where: "STATE_NAME = 'Alaska'"
 * })
 *   .then(result)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the query response.
 */
export declare function queryFeatures(requestOptions: IQueryFeaturesOptions): Promise<IQueryFeaturesResponse | IQueryResponse>;
