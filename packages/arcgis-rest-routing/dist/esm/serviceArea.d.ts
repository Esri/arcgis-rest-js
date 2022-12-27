import { ILocation, IPoint, IFeatureSet } from "@esri/arcgis-rest-request";
import { IEndpointOptions } from "./helpers.js";
export interface IServiceAreaOptions extends IEndpointOptions {
    /**
     *  Specify one or more locations around which service areas are generated.
     */
    facilities: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
    /**
     *  Specify if the service should return routes.
     */
    travelDirection?: "incidentsToFacilities" | "facilitiesToIncidents";
    barriers?: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
    polylineBarriers?: IFeatureSet;
    polygonBarriers?: IFeatureSet;
    outputLines?: boolean;
    returnFacilities?: boolean;
    returnBarriers?: boolean;
    returnPolylineBarriers?: boolean;
    returnPolygonBarriers?: boolean;
    preserveObjectID?: boolean;
}
interface IFeatureSetWithGeoJson extends IFeatureSet {
    geoJson?: any;
}
export interface IServiceAreaResponse {
    messages: string[];
    saPolygons?: IFeatureSetWithGeoJson;
    incidents?: IFeatureSet;
    facilities?: IFeatureSet;
    barriers?: IFeatureSet;
    polygonBarriers?: IFeatureSet;
    polylineBarriers?: IFeatureSet;
}
/**
 * Used to find the area that can be reached from the input location within a given travel time or travel distance. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm) for more information.
 *
 * ```js
 * import { serviceArea } from '@esri/arcgis-rest-routing';
 *
 * serviceArea({
 *   facilities: [
 *     [-90.444716, 38.635501],
 *     [-90.311919, 38.633523],
 *     [-90.451147, 38.581107]
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with service area polygons for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm
 */
export declare function serviceArea(requestOptions: IServiceAreaOptions): Promise<IServiceAreaResponse>;
declare const _default: {
    serviceArea: typeof serviceArea;
};
export default _default;
