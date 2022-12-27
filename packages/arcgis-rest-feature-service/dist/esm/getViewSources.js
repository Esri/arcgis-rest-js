/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
/**
 * Return the sources response for a view service item
 *
 * @param {string} viewServiceUrl
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<Record<string, unknown>>}
 */
export function getViewSources(viewServiceUrl, session) {
    return request(`${viewServiceUrl}/sources`, { authentication: session });
}
//# sourceMappingURL=getViewSources.js.map