"use strict";
/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeQueryString = exports.encodeParam = void 0;
const process_params_js_1 = require("./process-params.js");
/**
 * Encodes keys and parameters for use in a URL's query string.
 *
 * @param key Parameter's key
 * @param value Parameter's value
 * @returns Query string with key and value pairs separated by "&"
 */
function encodeParam(key, value) {
    // For array of arrays, repeat key=value for each element of containing array
    if (Array.isArray(value) && value[0] && Array.isArray(value[0])) {
        return value
            .map((arrayElem) => encodeParam(key, arrayElem))
            .join("&");
    }
    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
}
exports.encodeParam = encodeParam;
/**
 * Encodes the passed object as a query string.
 *
 * @param params An object to be encoded.
 * @returns An encoded query string.
 */
function encodeQueryString(params) {
    const newParams = (0, process_params_js_1.processParams)(params);
    return Object.keys(newParams)
        .map((key) => {
        return encodeParam(key, newParams[key]);
    })
        .join("&");
}
exports.encodeQueryString = encodeQueryString;
//# sourceMappingURL=encode-query-string.js.map