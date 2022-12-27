import { ILocation, IPoint, IFeatureSet } from "@esri/arcgis-rest-request";
import { IEndpointOptions } from "./helpers.js";
export interface IOriginDestinationMatrixOptions extends IEndpointOptions {
    /**
     *  Specify the starting points from which to travel to the destinations.
     */
    origins: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
    /**
     *  Specify the ending point locations to travel to from the origins.
     */
    destinations: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
    /**
     *  Specify the type of output returned by the service. Defaults to "esriNAODOutputSparseMatrix".
     */
    outputType?: "esriNAODOutputSparseMatrix" | "esriNAODOutputStraightLines" | "esriNAODOutputNoLines";
    barriers?: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
    polylineBarriers?: IFeatureSet;
    polygonBarriers?: IFeatureSet;
    returnOrigins?: boolean;
    returnDestinations?: boolean;
    returnBarriers?: boolean;
    returnPolylineBarriers?: boolean;
    returnPolygonBarriers?: boolean;
}
interface IFeatureSetWithGeoJson extends IFeatureSet {
    geoJson?: any;
}
export interface IOriginDestinationMatrixResponse {
    messages: [{
        type: number;
        description: string;
    }];
    /**
     *  Only present if outputType is "esriNAODOutputSparseMatrix". Full description is available at https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm#ESRI_SECTION2_114F8364507C4B56B780DFAD505270FB.
     */
    odCostMatrix?: any;
    /**
     *  Only present if outputType is "esriNAODOutputStraightLines" or "esriNAODOutputNoLines". Includes the geometry for the straight line connecting each origin-destination pair when the outputType is "esriNAODOutputStraightLines".
     */
    odLines?: IFeatureSetWithGeoJson;
    origins?: IFeatureSetWithGeoJson;
    destinations?: IFeatureSetWithGeoJson;
    barriers?: IFeatureSetWithGeoJson;
    polylineBarriers?: IFeatureSetWithGeoJson;
    polygonBarriers?: IFeatureSetWithGeoJson;
}
/**
 * Used to create an origin-destination (OD) cost matrix from multiple origins to multiple destinations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm) for more information.
 *
 * ```js
 * import { originDestinationMatrix } from '@esri/arcgis-rest-routing';
 *
 * originDestinationMatrix({
 *   origins: [
 *     [-90.404302, 38.600621],
 *     [-90.364293, 38.620427],
 *   ],
 *   destinations: [
 *     [-90.444716, 38.635501],
 *     [-90.311919, 38.633523],
 *     [-90.451147, 38.581107]
 *   ],
 *   authentication
 * })
 *   .then(response) // => { ... }
 * ```
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with travel time and/or distance for each origin-destination pair. It returns either odLines or odCostMatrix for this information depending on the outputType you specify.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm
 */
export declare function originDestinationMatrix(requestOptions: IOriginDestinationMatrixOptions): Promise<IOriginDestinationMatrixResponse>;
declare const _default: {
    originDestinationMatrix: typeof originDestinationMatrix;
};
export default _default;
