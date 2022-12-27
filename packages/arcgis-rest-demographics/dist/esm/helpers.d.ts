import { IRequestOptions, IFeatureSet } from "@esri/arcgis-rest-request";
export declare const ARCGIS_ONLINE_GEOENRICHMENT_URL: string;
export declare const ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL: string;
export interface IEndpointOptions extends IRequestOptions {
    /**
     * Any ArcGIS Geoenrichment service (example: https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment )
     */
    endpoint?: string;
}
export interface IGeoenrichmentResult {
    paramName: string;
    dataType: string;
    value: {
        version: string;
        FeatureSet: IFeatureSet[];
    };
}
