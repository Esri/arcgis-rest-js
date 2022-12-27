import { IRequestOptions, ILocation, IPoint, IPolyline, IFeatureSet } from "@esri/arcgis-rest-request";
export declare const ARCGIS_ONLINE_ROUTING_URL = "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
export declare const ARCGIS_ONLINE_CLOSEST_FACILITY_URL = "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";
export declare const ARCGIS_ONLINE_SERVICE_AREA_URL = "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World";
export declare const ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL = "https://route.arcgis.com/arcgis/rest/services/World/OriginDestinationCostMatrix/NAServer/OriginDestinationCostMatrix_World";
export interface IEndpointOptions extends IRequestOptions {
    /**
     * Any ArcGIS Routing service (example: https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route/ ) to use for the routing service request.
     */
    endpoint?: string;
}
export declare function normalizeLocationsList(locations: Array<IPoint | ILocation | [number, number]>): string[];
export declare function decompressGeometry(str: string): IPolyline;
/**
 * User Defined Type Guard that verifies this is a featureSet
 */
export declare function isFeatureSet(arg: any): arg is IFeatureSet;
/**
 * User Defined Type Guard that verifies this is a JSON with `url` property
 */
export declare function isJsonWithURL(arg: any): arg is Object;
