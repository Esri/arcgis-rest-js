"use strict";
/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isServiceNameAvailable = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Determine if a specific service name is available in the current user's organization
 *
 * @export
 * @param {string} name
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<IServiceNameAvailable>}
 */
function isServiceNameAvailable(name, type, session) {
    const url = `${session.portal}/portals/self/isServiceNameAvailable`;
    return (0, arcgis_rest_request_1.request)(url, {
        params: {
            name,
            type
        },
        httpMethod: "GET",
        authentication: session
    });
}
exports.isServiceNameAvailable = isServiceNameAvailable;
//# sourceMappingURL=is-service-name-available.js.map