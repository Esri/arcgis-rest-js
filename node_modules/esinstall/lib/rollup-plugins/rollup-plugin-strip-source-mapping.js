"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollupPluginStripSourceMapping = void 0;
/**
 * rollup-plugin-strip-source-mapping
 *
 * Remove any lingering source map comments
 */
function rollupPluginStripSourceMapping() {
    return {
        name: 'snowpack:rollup-plugin-strip-source-mapping',
        transform: (code) => ({
            code: code
                // [a-zA-Z0-9-_\*?\.\/\&=+%]: valid URL characters (for sourcemaps)
                .replace(/\/\/#\s*sourceMappingURL=[a-zA-Z0-9-_\*\?\.\/\&=+%\s]+$/gm, ''),
            map: null,
        }),
    };
}
exports.rollupPluginStripSourceMapping = rollupPluginStripSourceMapping;
//# sourceMappingURL=rollup-plugin-strip-source-mapping.js.map