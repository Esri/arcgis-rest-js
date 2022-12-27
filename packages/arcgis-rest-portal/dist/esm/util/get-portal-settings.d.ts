import { IRequestOptions, IExtent } from "@esri/arcgis-rest-request";
export interface IPortalSettings {
    allowedRedirectUris: string[];
    defaultExtent: IExtent;
    helperServices: {
        [key: string]: any;
    };
    informationalBanner: {
        [key: string]: any;
    };
    [key: string]: any;
}
/**
 * Fetch the settings for the current portal by id. If no id is passed, portals/self/settings will be called
 *
 * ```js
 * import { getPortalSettings } from "@esri/arcgis-rest-portal";
 *
 * getPortalSettings()
 * getPortalSettings("fe8")
 * getPortalSettings(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
 * ```
 *
 * @param id
 * @param requestOptions
 */
export declare function getPortalSettings(id?: string, requestOptions?: IRequestOptions): Promise<IPortalSettings>;
