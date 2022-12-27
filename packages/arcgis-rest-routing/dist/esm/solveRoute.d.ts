import { ILocation, IPoint, IFeature, IFeatureSet } from "@esri/arcgis-rest-request";
import { IEndpointOptions } from "./helpers.js";
interface IFeatureSetWithGeoJson extends IFeatureSet {
    geoJson?: {};
}
export interface ISolveRouteOptions extends IEndpointOptions {
    /**
     * Specify two or more locations between which the route is to be found.
     */
    stops: Array<IPoint | ILocation | [number, number] | [number, number, number]> | IFeatureSet;
}
export interface ISolveRouteResponse {
    messages: string[];
    checksum: string;
    routes: IFeatureSetWithGeoJson;
    directions?: Array<{
        routeId: number;
        routeName: string;
        summary: object;
        features: IFeature[];
    }>;
}
/**
 * Used to find the best way to get from one location to another or to visit several locations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm) for more information.
 *
 * ```js
 * import { solveRoute } from '@esri/arcgis-rest-routing';
 *
 * solveRoute({
 *   stops: [
 *     [-117.195677, 34.056383],
 *     [-117.918976, 33.812092],
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with routes and directions for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm
 */
export declare function solveRoute(requestOptions: ISolveRouteOptions): Promise<ISolveRouteResponse>;
declare const _default: {
    solveRoute: typeof solveRoute;
};
export default _default;
