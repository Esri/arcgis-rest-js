"use strict";
/* Copyright (c) 2017-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeQueryString = exports.decodeParam = void 0;
function decodeParam(param) {
    const [key, value] = param.split("=");
    return { key: decodeURIComponent(key), value: decodeURIComponent(value) };
}
exports.decodeParam = decodeParam;
/**
 * Decodes the passed query string as an object.
 *
 * @param query A string to be decoded.
 * @returns A decoded query param object.
 */
function decodeQueryString(query) {
    if (!query || query.length <= 0) {
        return {};
    }
    return query
        .replace(/^#/, "")
        .replace(/^\?/, "")
        .split("&")
        .reduce((acc, entry) => {
        const { key, value } = decodeParam(entry);
        acc[key] = value;
        return acc;
    }, {});
}
exports.decodeQueryString = decodeQueryString;
//# sourceMappingURL=decode-query-string.js.map