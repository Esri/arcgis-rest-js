/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
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
export function getServiceAdminInfo(serviceUrl, session) {
    const serviceAdminUrl = serviceUrl.replace("/rest/services", "/rest/admin/services");
    return request(serviceAdminUrl, {
        authentication: session,
        params: {
            f: "json"
        }
    });
}
//# sourceMappingURL=getServiceAdminInfo.js.map