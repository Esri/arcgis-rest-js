/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
/**
 * Determine if a specific service name is available in the current user's organization
 *
 * @export
 * @param {string} name
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<IServiceNameAvailable>}
 */
export function isServiceNameAvailable(name, type, session) {
    const url = `${session.portal}/portals/self/isServiceNameAvailable`;
    return request(url, {
        params: {
            name,
            type
        },
        httpMethod: "GET",
        authentication: session
    });
}
//# sourceMappingURL=is-service-name-available.js.map