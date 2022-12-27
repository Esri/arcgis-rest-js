"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollupPluginCatchUnresolved = void 0;
const builtin_modules_1 = __importDefault(require("builtin-modules"));
/**
 * rollup-plugin-catch-unresolved
 *
 * Catch any unresolved imports to give proper warnings (Rollup default is to ignore).
 */
function rollupPluginCatchUnresolved() {
    return {
        name: 'snowpack:rollup-plugin-catch-unresolved',
        resolveId(id, importer) {
            // Ignore remote http/https imports
            if (id.startsWith('http://') || id.startsWith('https://')) {
                return false;
            }
            if (builtin_modules_1.default.indexOf(id) !== -1) {
                this.warn({
                    id: importer,
                    message: `Module "${id}" (Node.js built-in) is not available in the browser. Run Snowpack with --polyfill-node to fix.`,
                });
            }
            else if (id.startsWith('./') || id.startsWith('../')) {
                this.warn({
                    id: importer,
                    message: `Import "${id}" could not be resolved from file.`,
                });
            }
            else {
                this.warn({
                    id: importer,
                    message: `Module "${id}" could not be resolved by Snowpack (Is it installed?).`,
                });
            }
            return false;
        },
    };
}
exports.rollupPluginCatchUnresolved = rollupPluginCatchUnresolved;
//# sourceMappingURL=rollup-plugin-catch-unresolved.js.map