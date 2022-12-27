"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
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
function getUser(requestOptions) {
    let url;
    let options = { httpMethod: "GET" };
    // if a username is passed, assume ArcGIS Online
    if (typeof requestOptions === "string") {
        url = `https://www.arcgis.com/sharing/rest/community/users/${requestOptions}`;
    }
    else {
        // if an authenticated session is passed, default to that user/portal unless another username is provided manually
        const username = requestOptions.username || requestOptions.authentication.username;
        url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/community/users/${encodeURIComponent(username)}`;
        options = Object.assign(Object.assign({}, requestOptions), options);
    }
    // send the request
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getUser = getUser;
//# sourceMappingURL=get-user.js.map