"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compact = void 0;
/**
 * Compress the given string by removing all newlines.
 *
 * @param text  The string that should be compressed.
 * @returns The string with all newlines stripped.
 */
function compact(options) {
    return options
        .fn(this)
        .split("\n")
        .map((line) => line.trim())
        .join("")
        .replace(/&nbsp;/g, " ")
        .trim();
}
exports.compact = compact;
