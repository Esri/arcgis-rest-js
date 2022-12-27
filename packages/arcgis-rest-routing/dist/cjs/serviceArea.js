"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceArea = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
const arcgis_1 = require("@terraformer/arcgis");
function getTravelDirection(key) {
    if (key === "incidentsToFacilities") {
        return "esriNATravelDirectionFromFacility";
    }
    else {
        return "esriNATravelDirectionToFacility";
    }
}
/**
 * Used to find the area that can be reached from the input location within a given travel time or travel distance. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm) for more information.
 *
 * ```js
 * import { serviceArea } from '@esri/arcgis-rest-routing';
 *
 * serviceArea({
 *   facilities: [
 *     [-90.444716, 38.635501],
 *     [-90.311919, 38.633523],
 *     [-90.451147, 38.581107]
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with service area polygons for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm
 */
function serviceArea(requestOptions) {
    const endpoint = requestOptions.endpoint || helpers_js_1.ARCGIS_ONLINE_SERVICE_AREA_URL;
    requestOptions.params = Object.assign({ returnFacilities: true, returnBarriers: true, returnPolylineBarriers: true, returnPolygonBarriers: true, preserveObjectID: true }, requestOptions.params);
    const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [
        "barriers",
        "polylineBarriers",
        "polygonBarriers",
        "outputLines",
        "returnFacilities",
        "returnBarriers",
        "returnPolylineBarriers",
        "returnPolygonBarriers",
        "preserveObjectID"
    ]);
    // Set travelDirection
    if (requestOptions.travelDirection) {
        options.params.travelDirection = getTravelDirection(requestOptions.travelDirection);
    }
    // the SAAS service does not support anonymous requests
    if (!requestOptions.authentication &&
        endpoint === helpers_js_1.ARCGIS_ONLINE_SERVICE_AREA_URL) {
        return Promise.reject("Finding service areas using the ArcGIS service requires authentication");
    }
    if ((0, helpers_js_1.isFeatureSet)(requestOptions.facilities)) {
        options.params.facilities = requestOptions.facilities;
    }
    else {
        options.params.facilities = (0, helpers_js_1.normalizeLocationsList)(requestOptions.facilities).join(";");
    }
    // optional input param that may need point geometry normalizing
    if (requestOptions.barriers) {
        if ((0, helpers_js_1.isFeatureSet)(requestOptions.barriers)) {
            options.params.barriers = requestOptions.barriers;
        }
        else {
            // optional point geometry barriers must be normalized, too
            // but not if provided as IFeatureSet type
            // note that optional polylineBarriers and polygonBarriers do not need to be normalized
            options.params.barriers = (0, helpers_js_1.normalizeLocationsList)(requestOptions.barriers).join(";");
        }
    }
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(endpoint)}/solveServiceArea`, options).then(cleanResponse);
}
exports.serviceArea = serviceArea;
function cleanResponse(res) {
    // remove "fieldAliases" because it does not do anything.
    delete res.saPolygons.fieldAliases;
    // add "geoJson" property to "saPolygons"
    if (res.saPolygons.spatialReference.wkid === 4326) {
        res.saPolygons.geoJson = (0, arcgis_1.arcgisToGeoJSON)(res.saPolygons);
    }
    return res;
}
exports.default = {
    serviceArea
};
//# sourceMappingURL=serviceArea.js.map