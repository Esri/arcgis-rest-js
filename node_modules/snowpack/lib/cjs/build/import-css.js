"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsCSSModules = exports.cssModuleJSON = exports.cssModules = void 0;
const postcss_1 = __importDefault(require("postcss"));
const postcss_modules_1 = __importDefault(require("postcss-modules"));
const logger_1 = require("../logger");
const cssModuleNames = new Map();
/** Generate CSS Modules for a given URL */
async function cssModules({ contents, url, }) {
    let json = {};
    const processor = postcss_1.default([
        postcss_modules_1.default({
            getJSON: (_, moduleNames) => {
                json = moduleNames;
                cssModuleNames.set(url, JSON.stringify(moduleNames));
            },
        }),
    ]);
    const result = await processor.process(contents, { from: url, to: url });
    // log any warnings that happened.
    result
        .warnings()
        .forEach((element) => logger_1.logger.warn(`${url} - ${element.text}`, { name: 'snowpack:cssmodules' }));
    return {
        css: result.css,
        json,
    };
}
exports.cssModules = cssModules;
/** Return CSS Modules JSON from URL */
function cssModuleJSON(url) {
    return cssModuleNames.get(url) || '{}';
}
exports.cssModuleJSON = cssModuleJSON;
/** Should this file get CSS Modules? */
function needsCSSModules(url) {
    return (url.endsWith('.module.css') || url.endsWith('.module.scss') || url.endsWith('.module.sass'));
}
exports.needsCSSModules = needsCSSModules;
