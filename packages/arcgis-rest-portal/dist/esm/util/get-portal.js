/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "./get-portal-url.js";
/**
 * Get the portal
 * @param requestOptions
 */
export function getSelf(requestOptions) {
    // just delegate to getPortal w/o an id
    return getPortal(null, requestOptions);
}
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
export function getPortal(id, requestOptions) {
    // construct the search url
    const idOrSelf = id ? id : "self";
    const url = `${getPortalUrl(requestOptions)}/portals/${idOrSelf}`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    // send the request
    return request(url, options);
}
//# sourceMappingURL=get-portal.js.map