"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseServiceUrl = void 0;
/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const serviceRegex = new RegExp(/.+(?:map|feature|image)server/i);
/**
 * Return the service url. If not matched, returns what was passed in
 */
function parseServiceUrl(url) {
    const match = url.match(serviceRegex);
    if (match) {
        return match[0];
    }
    else {
        return stripQueryString(url);
    }
}
exports.parseServiceUrl = parseServiceUrl;
function stripQueryString(url) {
    const stripped = url.split("?")[0];
    return (0, arcgis_rest_request_1.cleanUrl)(stripped);
}
//# sourceMappingURL=helpers.js.map