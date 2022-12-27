import { ILocation, IPoint, IFeature, IFeatureSet } from "@esri/arcgis-rest-request";
import { IEndpointOptions } from "./helpers.js";
export interface IClosestFacilityOptions extends IEndpointOptions {
    /**
     * Specify one or more locations from which the service searches for the nearby locations. These locations are referred to as incidents.
     */
    incidents: Array<IPoint | ILocation | [number, number]> | IFeatureSet | {
        url: string;
    };
    /**
     * Specify one or more locations that are searched for when finding the closest location.
     */
    facilities: Array<IPoint | ILocation | [number, number]> | IFeatureSet | {
        url: string;
    };
    /**
     *  Specify if the service should return routes.
     */
    returnCFRoutes: boolean;
    travelDirection?: "incidentsToFacilities" | "facilitiesToIncidents";
    barriers?: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
    polylineBarriers?: IFeatureSet;
    polygonBarriers?: IFeatureSet;
    returnDirections?: boolean;
    directionsOutputType?: "esriDOTComplete" | "esriDOTCompleteNoEvents" | "esriDOTInstructionsOnly" | "esriDOTStandard" | "esriDOTSummaryOnly" | "esriDOTFeatureSets";
    directionsLengthUnits?: "esriNAUCentimeters" | "esriNAUDecimalDegrees" | "esriNAUDecimeters" | "esriNAUFeet" | "esriNAUInches" | "esriNAUKilometers" | "esriNAUMeters" | "esriNAUMiles" | "esriNAUMillimeters" | "esriNAUNauticalMiles" | "esriNAUPoints" | "esriNAUYards";
    outputLines?: boolean;
    returnFacilities?: boolean;
    returnIncidents?: boolean;
    returnBarriers?: boolean;
    returnPolylineBarriers?: boolean;
    returnPolygonBarriers?: boolean;
    preserveObjectID?: boolean;
}
interface IFeatureSetWithGeoJson extends IFeatureSet {
    geoJson?: any;
}
export interface IClosestFacilityResponse {
    messages: string[];
    routes?: IFeatureSetWithGeoJson;
    directions?: Array<{
        routeId: number;
        routeName: string;
        summary: object;
        features: IFeature[];
    }>;
    incidents?: IFeatureSet;
    facilities?: IFeatureSet;
    barriers?: IFeatureSet;
    polygonBarriers?: IFeatureSet;
    polylineBarriers?: IFeatureSet;
}
/**
 * Used to find a route to the nearest of several possible destinations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm) for more information.
 *
 * ```js
 * import { closestFacility } from '@esri/arcgis-rest-routing';
 *
 * closestFacility({
 *   incidents: [
 *     [-90.404302, 38.600621],
 *     [-90.364293, 38.620427],
 *    ],
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
 * @returns A Promise that will resolve with routes and directions for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm
 * @inline IClosestFacilityOptions
 */
export declare function closestFacility(requestOptions: IClosestFacilityOptions): Promise<IClosestFacilityResponse>;
declare const _default: {
    closestFacility: typeof closestFacility;
};
export default _default;
