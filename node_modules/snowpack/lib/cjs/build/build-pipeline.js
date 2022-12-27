"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFile = exports.runPipelineCleanupStep = exports.runPipelineOptimizeStep = void 0;
const path_1 = __importDefault(require("path"));
const source_map_1 = require("source-map");
const url_1 = __importDefault(require("url"));
const config_1 = require("../config");
const logger_1 = require("../logger");
const util_1 = require("../util");
const import_css_1 = require("./import-css");
/**
 * Build Plugin First Pass: If a plugin defines a
 * `resolve` object, check it against the current
 * file's extension. If it matches, call the load()
 * functon and return it's result.
 *
 * If no match is found, fall back to just reading
 * the file from disk and return it.
 */
async function runPipelineLoadStep(srcPath, { isDev, isSSR, isPackage, isHmrEnabled, config }) {
    const srcExt = util_1.getExtension(srcPath);
    const result = {};
    for (const step of config.plugins) {
        if (!step.resolve || !step.resolve.input.some((ext) => srcPath.endsWith(ext))) {
            continue;
        }
        if (!step.load) {
            continue;
        }
        // v3.1: Some plugins break when run on node_modules/. This fix is in place until the plugins themselves have a chance to update.
        if (step.name.endsWith('@prefresh/snowpack/dist/index.js') && isPackage) {
            continue;
        }
        try {
            const debugPath = path_1.default.relative(config.root, srcPath);
            logger_1.logger.debug(`load() starting… [${debugPath}]`, { name: step.name });
            const stepResult = await step.load({
                fileExt: srcExt,
                filePath: srcPath,
                isDev,
                isSSR,
                isPackage,
                isHmrEnabled,
            });
            logger_1.logger.debug(`✔ load() success [${debugPath}]`, { name: step.name });
            config_1.validatePluginLoadResult(step, stepResult);
            if (typeof stepResult === 'string' || Buffer.isBuffer(stepResult)) {
                const mainOutputExt = step.resolve.output[0];
                result[mainOutputExt] = { code: stepResult };
            }
            else if (stepResult && typeof stepResult === 'object') {
                Object.keys(stepResult).forEach((ext) => {
                    const output = stepResult[ext];
                    // normalize to {code, map} format
                    if (typeof output === 'string' || Buffer.isBuffer(output)) {
                        result[ext] = { code: output };
                    }
                    else if (output) {
                        result[ext] = output;
                    }
                    // ensure source maps are strings (it’s easy for plugins to pass back a JSON object)
                    if (result[ext].map && typeof result[ext].map === 'object') {
                        result[ext].map = JSON.stringify(stepResult[ext].map);
                    }
                    // if source maps disabled, don’t return any
                    if (!config.buildOptions.sourcemap)
                        result[ext].map = undefined;
                });
                break;
            }
        }
        catch (err) {
            // Attach metadata detailing where the error occurred.
            err.__snowpackBuildDetails = { name: step.name, step: 'load' };
            throw err;
        }
    }
    // handle CSS Modules, after plugins run
    if (import_css_1.needsCSSModules(srcPath)) {
        let contents = result['.css']
            ? result['.css'].code
            : (await util_1.readFile(srcPath));
        if (contents) {
            // for CSS Modules URLs, we only need the destination URL (POSIX-style)
            let url = srcPath;
            for (const dir in config.mount) {
                if (srcPath.startsWith(dir)) {
                    url = srcPath
                        .replace(dir, config.mount[dir].url)
                        .replace(/\\/g, '/')
                        .replace(/\/+/g, '/')
                        .replace(/\.(scss|sass)$/i, '.css');
                    break;
                }
            }
            const { css, json } = await import_css_1.cssModules({ contents, url });
            result['.css'] = { ...(result['.css'] || {}), code: css };
            result['.json'] = { code: JSON.stringify(json) };
        }
    }
    // if no result was generated, return file as-is
    if (!Object.keys(result).length) {
        return {
            [srcExt]: {
                code: await util_1.readFile(srcPath),
            },
        };
    }
    return result;
}
async function composeSourceMaps(id, base, derived) {
    const [baseMap, transformedMap] = await Promise.all([
        new source_map_1.SourceMapConsumer(base),
        new source_map_1.SourceMapConsumer(derived),
    ]);
    try {
        const generator = source_map_1.SourceMapGenerator.fromSourceMap(transformedMap);
        generator.applySourceMap(baseMap, id);
        return generator.toString();
    }
    finally {
        baseMap.destroy();
        transformedMap.destroy();
    }
}
/**
 * Build Plugin Second Pass: If a plugin defines a
 * transform() method,call it. Transform cannot change
 * the file extension, and was designed to run on
 * every file type and return null/undefined if no
 * change needed.
 */
async function runPipelineTransformStep(output, srcPath, { isDev, isHmrEnabled, isPackage, isSSR, config }) {
    const rootFilePath = util_1.removeExtension(srcPath, util_1.getExtension(srcPath));
    const rootFileName = path_1.default.basename(rootFilePath);
    for (const step of config.plugins) {
        if (!step.transform) {
            continue;
        }
        // v3.1: Some plugins break when run on node_modules/. This fix is in place until the plugins themselves have a chance to update.
        if (step.name.endsWith('@prefresh/snowpack/dist/index.js') && isPackage) {
            continue;
        }
        try {
            for (const destExt of Object.keys(output)) {
                const destBuildFile = output[destExt];
                const { code } = destBuildFile;
                const fileName = rootFileName + destExt;
                const filePath = rootFilePath + destExt;
                const debugPath = path_1.default.relative(config.root, filePath);
                logger_1.logger.debug(`transform() starting… [${debugPath}]`, { name: step.name });
                const result = await step.transform({
                    contents: code,
                    isDev,
                    isPackage,
                    fileExt: destExt,
                    id: filePath,
                    srcPath,
                    // @ts-ignore: Deprecated
                    filePath: fileName,
                    // @ts-ignore: Deprecated
                    urlPath: `./${path_1.default.basename(rootFileName + destExt)}`,
                    isHmrEnabled,
                    isSSR,
                });
                logger_1.logger.debug(`✔ transform() success [${debugPath}]`, { name: step.name });
                if (typeof result === 'string' || Buffer.isBuffer(result)) {
                    // V2 API, simple string variant
                    output[destExt].code = result;
                    output[destExt].map = undefined;
                }
                else if (result && typeof result === 'object') {
                    // V2 API, structured result variant
                    const contents = result.contents || result.result;
                    if (contents) {
                        output[destExt].code = contents;
                        const map = result.map;
                        let outputMap = undefined;
                        if (map && config.buildOptions.sourcemap) {
                            // if source maps disabled, don’t return any
                            if (output[destExt].map) {
                                outputMap = await composeSourceMaps(filePath, output[destExt].map, map);
                            }
                            else {
                                outputMap = typeof map === 'object' ? JSON.stringify(map) : map;
                            }
                        }
                        output[destExt].map = outputMap;
                    }
                }
            }
        }
        catch (err) {
            // Attach metadata detailing where the error occurred.
            err.__snowpackBuildDetails = { name: step.name, step: 'transform' };
            throw err;
        }
    }
    return output;
}
async function runPipelineOptimizeStep(buildDirectory, { config }) {
    for (const step of config.plugins) {
        if (!step.optimize) {
            continue;
        }
        try {
            logger_1.logger.debug('optimize() starting…', { name: step.name });
            await step.optimize({
                buildDirectory,
                // @ts-ignore: internal API only
                log: (msg) => {
                    logger_1.logger.info(msg, { name: step.name });
                },
            });
            logger_1.logger.debug('✔ optimize() success', { name: step.name });
        }
        catch (err) {
            logger_1.logger.error(err.toString() || err, { name: step.name });
            process.exit(1); // exit on error
        }
    }
    return null;
}
exports.runPipelineOptimizeStep = runPipelineOptimizeStep;
async function runPipelineCleanupStep({ plugins }) {
    for (const step of plugins) {
        if (!step.cleanup) {
            continue;
        }
        await step.cleanup();
    }
}
exports.runPipelineCleanupStep = runPipelineCleanupStep;
/** Core Snowpack file pipeline builder */
async function buildFile(srcURL, buildFileOptions) {
    // Pass 1: Find the first plugin to load this file, and return the result
    const loadResult = await runPipelineLoadStep(url_1.default.fileURLToPath(srcURL), buildFileOptions);
    // Pass 2: Pass that result through every plugin transform() method.
    const transformResult = await runPipelineTransformStep(loadResult, url_1.default.fileURLToPath(srcURL), buildFileOptions);
    // Return the final build result.
    return transformResult;
}
exports.buildFile = buildFile;
