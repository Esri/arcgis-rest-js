"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollupPluginNodeProcessPolyfill = void 0;
const plugin_inject_1 = __importDefault(require("@rollup/plugin-inject"));
const generateProcessPolyfill_1 = __importDefault(require("./generateProcessPolyfill"));
const PROCESS_MODULE_NAME = 'process';
function rollupPluginNodeProcessPolyfill(env = {}) {
    const injectPlugin = plugin_inject_1.default({
        process: PROCESS_MODULE_NAME,
        include: /\.(cjs|js|jsx|mjs|ts|tsx)$/, // only target JavaScript files
    });
    return {
        ...injectPlugin,
        name: 'snowpack:rollup-plugin-node-process-polyfill',
        resolveId(source) {
            if (source === PROCESS_MODULE_NAME) {
                return PROCESS_MODULE_NAME;
            }
            return null;
        },
        load(id) {
            if (id === PROCESS_MODULE_NAME) {
                return { code: generateProcessPolyfill_1.default(env), moduleSideEffects: false };
            }
            return null;
        },
    };
}
exports.rollupPluginNodeProcessPolyfill = rollupPluginNodeProcessPolyfill;
//# sourceMappingURL=rollup-plugin-node-process-polyfill.js.map