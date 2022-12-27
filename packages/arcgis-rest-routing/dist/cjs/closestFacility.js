"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.closestFacility = void 0;
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
 * Used to find a route to the nearest of several possible destinations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm) for more information.
 *
 * ```js
 * import { closestFacility } from '@esri/arcgis-rest-routing';
 *
 * closestFacility({
 *   incidents: [
 *     [-90.404302, 38.600621],
 *     [-90.364293, 38.620427],
 *    ],
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
 * @returns A Promise that will resolve with routes and directions for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm
 * @inline IClosestFacilityOptions
 */
function closestFacility(requestOptions) {
    const endpoint = requestOptions.endpoint || helpers_js_1.ARCGIS_ONLINE_CLOSEST_FACILITY_URL;
    requestOptions.params = Object.assign({ returnFacilities: true, returnDirections: true, returnIncidents: true, returnBarriers: true, returnPolylineBarriers: true, returnPolygonBarriers: true, preserveObjectID: true }, requestOptions.params);
    const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [
        "returnCFRoutes",
        // "travelDirection",
        "barriers",
        "polylineBarriers",
        "polygonBarriers",
        "returnDirections",
        "directionsOutputType",
        "directionsLengthUnits",
        "outputLines",
        "returnFacilities",
        "returnIncidents",
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
        endpoint === helpers_js_1.ARCGIS_ONLINE_CLOSEST_FACILITY_URL) {
        return Promise.reject("Finding the closest facility using the ArcGIS service requires authentication");
    }
    if ((0, helpers_js_1.isFeatureSet)(requestOptions.incidents) ||
        (0, helpers_js_1.isJsonWithURL)(requestOptions.incidents)) {
        options.params.incidents = requestOptions.incidents;
    }
    else {
        options.params.incidents = (0, helpers_js_1.normalizeLocationsList)(requestOptions.incidents).join(";");
    }
    if ((0, helpers_js_1.isFeatureSet)(requestOptions.facilities) ||
        (0, helpers_js_1.isJsonWithURL)(requestOptions.facilities)) {
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
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(endpoint)}/solveClosestFacility`, options).then(cleanResponse);
}
exports.closestFacility = closestFacility;
function cleanResponse(res) {
    // add "geoJson" property to "routes"
    if (res.routes.spatialReference.wkid === 4326) {
        res.routes.geoJson = (0, arcgis_1.arcgisToGeoJSON)(res.routes);
    }
    return res;
}
exports.default = {
    closestFacility
};
//# sourceMappingURL=closestFacility.js.map