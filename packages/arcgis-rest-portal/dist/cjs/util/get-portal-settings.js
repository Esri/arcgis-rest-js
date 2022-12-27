"use strict";
/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortalSettings = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("./get-portal-url.js");
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
function getPortalSettings(id, requestOptions) {
    // construct the search url
    const idOrSelf = id ? id : "self";
    const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/portals/${idOrSelf}/settings`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    // send the request
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getPortalSettings = getPortalSettings;
//# sourceMappingURL=get-portal-settings.js.map