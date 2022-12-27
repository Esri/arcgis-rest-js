"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonWithURL = exports.isFeatureSet = exports.decompressGeometry = exports.normalizeLocationsList = exports.ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL = exports.ARCGIS_ONLINE_SERVICE_AREA_URL = exports.ARCGIS_ONLINE_CLOSEST_FACILITY_URL = exports.ARCGIS_ONLINE_ROUTING_URL = void 0;
// https always
exports.ARCGIS_ONLINE_ROUTING_URL = "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
exports.ARCGIS_ONLINE_CLOSEST_FACILITY_URL = "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";
exports.ARCGIS_ONLINE_SERVICE_AREA_URL = "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World";
exports.ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL = "https://route.arcgis.com/arcgis/rest/services/World/OriginDestinationCostMatrix/NAServer/OriginDestinationCostMatrix_World";
function isLocationArray(coords) {
    return (coords.length === 2 ||
        coords.length === 3);
}
function isLocation(coords) {
    return (coords.latitude !== undefined ||
        coords.lat !== undefined);
}
function normalizeLocationsList(locations) {
    return locations.map((coords) => {
        if (isLocationArray(coords)) {
            return coords.join();
        }
        else if (isLocation(coords)) {
            if (coords.lat) {
                return coords.long + "," + coords.lat;
            }
            else {
                return coords.longitude + "," + coords.latitude;
            }
        }
        else {
            return coords.x + "," + coords.y;
        }
    });
}
exports.normalizeLocationsList = normalizeLocationsList;
function decompressGeometry(str) {
    let xDiffPrev = 0;
    let yDiffPrev = 0;
    const points = [];
    let x;
    let y;
    // Split the string into an array on the + and - characters
    const strings = str.match(/((\+|-)[^+-]+)/g);
    // The first value is the coefficient in base 32
    const coefficient = parseInt(strings[0], 32);
    for (let j = 1; j < strings.length; j += 2) {
        // j is the offset for the x value
        // Convert the value from base 32 and add the previous x value
        x = parseInt(strings[j], 32) + xDiffPrev;
        xDiffPrev = x;
        // j+1 is the offset for the y value
        // Convert the value from base 32 and add the previous y value
        y = parseInt(strings[j + 1], 32) + yDiffPrev;
        yDiffPrev = y;
        points.push([x / coefficient, y / coefficient]);
    }
    return {
        paths: [points]
    };
}
exports.decompressGeometry = decompressGeometry;
/**
 * User Defined Type Guard that verifies this is a featureSet
 */
function isFeatureSet(arg) {
    return Object.prototype.hasOwnProperty.call(arg, "features");
}
exports.isFeatureSet = isFeatureSet;
/**
 * User Defined Type Guard that verifies this is a JSON with `url` property
 */
function isJsonWithURL(arg) {
    return "url" in arg;
}
exports.isJsonWithURL = isJsonWithURL;
//# sourceMappingURL=helpers.js.map