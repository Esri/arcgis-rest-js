"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.solveRoute = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
const arcgis_1 = require("@terraformer/arcgis");
function isLocationArray(coords) {
    return (coords.length === 2 ||
        coords.length === 3);
}
function isLocation(coords) {
    return (coords.latitude !== undefined ||
        coords.lat !== undefined);
}
/**
 * Used to find the best way to get from one location to another or to visit several locations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm) for more information.
 *
 * ```js
 * import { solveRoute } from '@esri/arcgis-rest-routing';
 *
 * solveRoute({
 *   stops: [
 *     [-117.195677, 34.056383],
 *     [-117.918976, 33.812092],
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with routes and directions for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm
 */
function solveRoute(requestOptions) {
    const options = Object.assign({ endpoint: requestOptions.endpoint || helpers_js_1.ARCGIS_ONLINE_ROUTING_URL, params: {} }, requestOptions);
    // the SAAS service does not support anonymous requests
    if (!requestOptions.authentication &&
        options.endpoint === helpers_js_1.ARCGIS_ONLINE_ROUTING_URL) {
        return Promise.reject("Routing using the ArcGIS service requires authentication");
    }
    if ((0, helpers_js_1.isFeatureSet)(requestOptions.stops)) {
        options.params.stops = requestOptions.stops;
    }
    else {
        const stops = requestOptions.stops.map((coords) => {
            if (isLocationArray(coords)) {
                return coords.join();
            }
            else if (isLocation(coords)) {
                if (coords.lat) {
                    return (coords.long + "," + coords.lat + (coords.z ? "," + coords.z : ""));
                }
                else {
                    return (coords.longitude +
                        "," +
                        coords.latitude +
                        (coords.z ? "," + coords.z : ""));
                }
            }
            else {
                return coords.x + "," + coords.y + (coords.z ? "," + coords.z : "");
            }
        });
        options.params.stops = stops.join(";");
    }
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(options.endpoint)}/solve`, options).then(cleanResponse);
}
exports.solveRoute = solveRoute;
function cleanResponse(res) {
    if (res.directions && res.directions.length > 0) {
        res.directions = res.directions.map((direction) => {
            direction.features = direction.features.map((feature) => {
                feature.geometry = (0, helpers_js_1.decompressGeometry)(feature.compressedGeometry);
                return feature;
            });
            return direction;
        });
    }
    // add "geoJson" property to "routes"
    if (res.routes.spatialReference.wkid === 4326) {
        const features = res.routes.features.map((feature) => {
            return {
                type: "Feature",
                geometry: (0, arcgis_1.arcgisToGeoJSON)(feature.geometry),
                properties: Object.assign({}, feature.attributes)
            };
        });
        res.routes.geoJson = {
            type: "FeatureCollection",
            features
        };
    }
    return res;
}
exports.default = {
    solveRoute
};
//# sourceMappingURL=solveRoute.js.map