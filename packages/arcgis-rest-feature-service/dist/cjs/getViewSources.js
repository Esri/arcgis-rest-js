"use strict";
/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewSources = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Return the sources response for a view service item
 *
 * @param {string} viewServiceUrl
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<Record<string, unknown>>}
 */
function getViewSources(viewServiceUrl, session) {
    return (0, arcgis_rest_request_1.request)(`${viewServiceUrl}/sources`, { authentication: session });
}
exports.getViewSources = getViewSources;
//# sourceMappingURL=getViewSources.js.map