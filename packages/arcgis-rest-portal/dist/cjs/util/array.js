"use strict";
/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunk = void 0;
function chunk(array, size) {
    if (array.length === 0) {
        return [];
    }
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
exports.chunk = chunk;
//# sourceMappingURL=array.js.map