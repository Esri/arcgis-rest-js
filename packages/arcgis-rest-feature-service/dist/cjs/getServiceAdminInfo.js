"use strict";
/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceAdminInfo = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Given a Feature Service url, fetch the service admin information.
 *
 * The response from this call includes all the detailed information
 * for each layer/table in the service as well as some admin properties
 *
 * @export
 * @param {string} serviceUrl
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<IServiceInfo>}
 */
function getServiceAdminInfo(serviceUrl, session) {
    const serviceAdminUrl = serviceUrl.replace("/rest/services", "/rest/admin/services");
    return (0, arcgis_rest_request_1.request)(serviceAdminUrl, {
        authentication: session,
        params: {
            f: "json"
        }
    });
}
exports.getServiceAdminInfo = getServiceAdminInfo;
//# sourceMappingURL=getServiceAdminInfo.js.map