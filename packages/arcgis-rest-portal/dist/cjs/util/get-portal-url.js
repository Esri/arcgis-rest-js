"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortalUrl = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Helper that returns the appropriate portal url for a given request. `requestOptions.portal` is given
 * precedence over `authentication.portal`. If neither `portal` nor `authentication` is present,
 * `www.arcgis.com/sharing/rest` is returned.
 *
 * @param requestOptions - Request options that may have authentication manager
 * @returns Portal url to be used in API requests
 */
function getPortalUrl(requestOptions = {}) {
    // use portal in options if specified
    if (requestOptions.portal) {
        return (0, arcgis_rest_request_1.cleanUrl)(requestOptions.portal);
    }
    // if auth was passed, use that portal
    if (requestOptions.authentication &&
        typeof requestOptions.authentication !== "string") {
        // the portal url is already scrubbed in the auth package
        return requestOptions.authentication.portal;
    }
    // default to arcgis.com
    return "https://www.arcgis.com/sharing/rest";
}
exports.getPortalUrl = getPortalUrl;
//# sourceMappingURL=get-portal-url.js.map