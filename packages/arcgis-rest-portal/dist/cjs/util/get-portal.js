"use strict";
/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortal = exports.getSelf = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("./get-portal-url.js");
/**
 * Get the portal
 * @param requestOptions
 */
function getSelf(requestOptions) {
    // just delegate to getPortal w/o an id
    return getPortal(null, requestOptions);
}
exports.getSelf = getSelf;
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
function getPortal(id, requestOptions) {
    // construct the search url
    const idOrSelf = id ? id : "self";
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/portals/${idOrSelf}`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    // send the request
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getPortal = getPortal;
//# sourceMappingURL=get-portal.js.map