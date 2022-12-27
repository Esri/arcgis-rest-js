import { IRequestOptions } from "@esri/arcgis-rest-request";
export interface IPortal {
    id: string;
    isPortal: boolean;
    name: string;
    [key: string]: any;
}
/**
 * Get the portal
 * @param requestOptions
 */
export declare function getSelf(requestOptions?: IRequestOptions): Promise<IPortal>;
/**
 * Fetch information about the specified portal by id. If no id is passed, portals/self will be called.
 *
 * If you intend to request a portal by id and it is different from the portal specified by options.authentication, you must also pass options.portal.
 *
 *  ```js
 * import { getPortal } from "@esri/arcgis-rest-portal";
 * //
 * getPortal()
 * getPortal("fe8")
 * getPortal(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
 * ```
 *
 * @param id
 * @param requestOptions
 */
export declare function getPortal(id?: string, requestOptions?: IRequestOptions): Promise<IPortal>;
