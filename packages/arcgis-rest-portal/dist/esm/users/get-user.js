/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
/**
 * Get information about a user. This method has proven so generically useful that you can also call {@linkcode ArcGISIdentityManager.getUser}.
 *
 * ```js
 * import { getUser } from '@esri/arcgis-rest-portal';
 * //
 * getUser("jsmith")
 *   .then(response)
 * // => { firstName: "John", lastName: "Smith",tags: ["GIS Analyst", "City of Redlands"] }
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metadata about the user
 */
export function getUser(requestOptions) {
    let url;
    let options = { httpMethod: "GET" };
    // if a username is passed, assume ArcGIS Online
    if (typeof requestOptions === "string") {
        url = `https://www.arcgis.com/sharing/rest/community/users/${requestOptions}`;
    }
    else {
        // if an authenticated session is passed, default to that user/portal unless another username is provided manually
        const username = requestOptions.username || requestOptions.authentication.username;
        url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}`;
        options = Object.assign(Object.assign({}, requestOptions), options);
    }
    // send the request
    return request(url, options);
}
//# sourceMappingURL=get-user.js.map