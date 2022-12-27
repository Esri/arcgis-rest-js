import { IRequestOptions } from "@esri/arcgis-rest-request";
export interface ISubscriptionInfo {
    id: string;
    [key: string]: any;
}
/**
 * Fetch subscription information about the current portal by id. If no id is passed, portals/self/subscriptionInfo will be called
 *
 * ```js
 * import { getSubscriptionInfo } from "@esri/arcgis-rest-portal";
 *
 * getSubscriptionInfo()
 * getSubscriptionInfo("fe8")
 * getSubscriptionInfo(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
 * ```
 *
 * @param id
 * @param requestOptions
 */
export declare function getSubscriptionInfo(id?: string, requestOptions?: IRequestOptions): Promise<ISubscriptionInfo>;
