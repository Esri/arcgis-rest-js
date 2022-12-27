"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyFlag = exports.hasAllFlags = exports.removeFlag = exports.getEnumFlags = void 0;
function getEnumFlags(flags) {
    const result = [];
    for (let i = 1; i <= flags; i *= 2) {
        if (flags & i) {
            result.push(i);
        }
    }
    return result;
}
exports.getEnumFlags = getEnumFlags;
// T & {} reduces inference priority
function removeFlag(flag, remove) {
    return ((flag ^ remove) & flag);
}
exports.removeFlag = removeFlag;
function hasAllFlags(flags, check) {
    return (flags & check) === check;
}
exports.hasAllFlags = hasAllFlags;
function hasAnyFlag(flags, check) {
    return (flags & check) !== 0;
}
exports.hasAnyFlag = hasAnyFlag;
