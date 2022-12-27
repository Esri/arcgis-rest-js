"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = exports.printStats = exports.resolveDependencyManifest = exports.explodeExportMap = exports.resolveEntrypoint = exports.findManifestEntry = exports.findExportMapEntry = void 0;
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const es_module_lexer_1 = require("es-module-lexer");
const fs_1 = __importDefault(require("fs"));
const colors = __importStar(require("kleur/colors"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const rollup_1 = require("rollup");
const rollup_plugin_polyfill_node_1 = __importDefault(require("rollup-plugin-polyfill-node"));
const plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
const rollup_plugin_alias_1 = require("./rollup-plugins/rollup-plugin-alias");
const rollup_plugin_catch_fetch_1 = require("./rollup-plugins/rollup-plugin-catch-fetch");
const rollup_plugin_catch_unresolved_1 = require("./rollup-plugins/rollup-plugin-catch-unresolved");
const rollup_plugin_css_1 = require("./rollup-plugins/rollup-plugin-css");
const rollup_plugin_node_process_polyfill_1 = require("./rollup-plugins/rollup-plugin-node-process-polyfill");
const rollup_plugin_stats_1 = require("./rollup-plugins/rollup-plugin-stats");
const rollup_plugin_strip_source_mapping_1 = require("./rollup-plugins/rollup-plugin-strip-source-mapping");
const rollup_plugin_wrap_install_targets_1 = require("./rollup-plugins/rollup-plugin-wrap-install-targets");
const util_1 = require("./util");
const entrypoints_1 = require("./entrypoints");
__exportStar(require("./types"), exports);
var entrypoints_2 = require("./entrypoints");
Object.defineProperty(exports, "findExportMapEntry", { enumerable: true, get: function () { return entrypoints_2.findExportMapEntry; } });
Object.defineProperty(exports, "findManifestEntry", { enumerable: true, get: function () { return entrypoints_2.findManifestEntry; } });
Object.defineProperty(exports, "resolveEntrypoint", { enumerable: true, get: function () { return entrypoints_2.resolveEntrypoint; } });
Object.defineProperty(exports, "explodeExportMap", { enumerable: true, get: function () { return entrypoints_2.explodeExportMap; } });
var util_2 = require("./util");
Object.defineProperty(exports, "resolveDependencyManifest", { enumerable: true, get: function () { return util_2.resolveDependencyManifest; } });
var stats_1 = require("./stats");
Object.defineProperty(exports, "printStats", { enumerable: true, get: function () { return stats_1.printStats; } });
function isImportOfPackage(importUrl, packageName) {
    return packageName === importUrl || importUrl.startsWith(packageName + '/');
}
/**
 * Resolve a "webDependencies" input value to the correct absolute file location.
 * Supports both npm package names, and file paths relative to the node_modules directory.
 * Follows logic similar to Node's resolution logic, but using a package.json's ESM "module"
 * field instead of the CJS "main" field.
 */
function resolveWebDependency(dep, resolveOptions) {
    const loc = entrypoints_1.resolveEntrypoint(dep, resolveOptions);
    return {
        loc,
        type: util_1.getWebDependencyType(loc),
    };
}
function generateEnvObject(userEnv) {
    return {
        NODE_ENV: userEnv.NODE_ENV || process.env.NODE_ENV || 'production',
        ...Object.keys(userEnv).reduce((acc, key) => {
            const value = userEnv[key];
            acc[key] = value === true ? process.env[key] : value;
            return acc;
        }, {}),
    };
}
function generateReplacements(env) {
    return Object.keys(env).reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(env[key]);
        return acc;
    }, {
    // Other find & replacements:
    });
}
const FAILED_INSTALL_MESSAGE = (message) => !message ? 'Install failed.' : `Install failed ${message}.`;
function setOptionDefaults(_options) {
    if (_options.lockfile) {
        throw new Error('[esinstall@1.0.0] option `lockfile` was renamed to `importMap`.');
    }
    if (_options.sourceMap) {
        throw new Error('[esinstall@1.0.0] option `sourceMap` was renamed to `sourcemap`.');
    }
    if (_options.externalPackage) {
        throw new Error('[esinstall@1.0.0] option `externalPackage` was renamed to `external`.');
    }
    if (_options.externalPackageEsm) {
        throw new Error('[esinstall@1.0.0] option `externalPackageEsm` was renamed to `externalEsm`.');
    }
    const options = {
        cwd: process.cwd(),
        alias: {},
        logger: {
            debug: () => { },
            log: console.log,
            warn: console.warn,
            error: console.error,
        },
        // TODO: Make this default to false in a v2.0 release
        stats: true,
        dest: 'web_modules',
        external: [],
        externalEsm: [],
        polyfillNode: false,
        packageLookupFields: [],
        packageExportLookupFields: [],
        env: {},
        namedExports: [],
        rollup: {
            plugins: [],
            dedupe: [],
        },
        ..._options,
    };
    options.dest = path_1.default.resolve(options.cwd, options.dest);
    return options;
}
async function install(_installTargets, _options = {}) {
    var _a;
    const { cwd, alias: installAlias, importMap: _importMap, logger, dest: destLoc, external, externalEsm, sourcemap, env: userEnv, stats, rollup: userDefinedRollup, treeshake: isTreeshake, polyfillNode, packageLookupFields, packageExportLookupFields, } = setOptionDefaults(_options);
    const env = generateEnvObject(userEnv);
    const installTargets = _installTargets.map((t) => typeof t === 'string' ? util_1.createInstallTarget(t) : t);
    // TODO: warn if import from  "firebase", since that includes so many Node-specific files
    const allInstallSpecifiers = new Set(installTargets
        .filter((dep) => !external.some((packageName) => isImportOfPackage(dep.specifier, packageName)))
        .map((dep) => dep.specifier)
        .map((specifier) => {
        const aliasEntry = util_1.findMatchingAliasEntry(installAlias, specifier);
        return aliasEntry && aliasEntry.type === 'package' ? aliasEntry.to : specifier;
    })
        .map((specifier) => specifier.replace(/(\/|\\)+$/, '')) // remove trailing slash from end of specifier (easier for Node to resolve)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));
    const installEntrypoints = {};
    const assetEntrypoints = {};
    const importMap = { imports: {} };
    let dependencyStats = null;
    const skipFailures = false;
    for (const installSpecifier of allInstallSpecifiers) {
        let targetName = util_1.getWebDependencyName(installSpecifier);
        let proxiedName = util_1.sanitizePackageName(targetName); // sometimes we need to sanitize webModule names, as in the case of tippy.js -> tippyjs
        if (_importMap) {
            if (_importMap.imports[installSpecifier]) {
                installEntrypoints[targetName] = _importMap.imports[installSpecifier];
                if (!path_1.default.extname(installSpecifier) || util_1.isJavaScript(installSpecifier)) {
                    importMap.imports[installSpecifier] = `./${proxiedName}.js`;
                }
                else {
                    importMap.imports[installSpecifier] = `./${proxiedName}`;
                }
                continue;
            }
            const findFolderImportEntry = Object.entries(_importMap.imports).find(([entry]) => {
                return entry.endsWith('/') && installSpecifier.startsWith(entry);
            });
            if (findFolderImportEntry) {
                installEntrypoints[targetName] =
                    findFolderImportEntry[1] + targetName.substr(findFolderImportEntry[0].length);
                if (!path_1.default.extname(installSpecifier) || util_1.isJavaScript(installSpecifier)) {
                    importMap.imports[installSpecifier] = `./${proxiedName}.js`;
                }
                else {
                    importMap.imports[installSpecifier] = `./${proxiedName}`;
                }
                continue;
            }
        }
        try {
            const resolvedResult = resolveWebDependency(installSpecifier, {
                cwd,
                packageLookupFields,
            });
            if (resolvedResult.type === 'BUNDLE') {
                installEntrypoints[targetName] = resolvedResult.loc;
                importMap.imports[installSpecifier] = `./${proxiedName}.js`;
                Object.entries(installAlias)
                    .filter(([, value]) => value === installSpecifier)
                    .forEach(([key]) => {
                    importMap.imports[key] = `./${targetName}.js`;
                });
            }
            else if (resolvedResult.type === 'ASSET') {
                // add extension if missing
                const isMissingExt = path_1.default.extname(resolvedResult.loc) && !path_1.default.extname(proxiedName);
                if (isMissingExt) {
                    const ext = path_1.default.basename(resolvedResult.loc).replace(/[^.]+/, '');
                    targetName += ext;
                    proxiedName += ext;
                }
                assetEntrypoints[targetName] = resolvedResult.loc;
                importMap.imports[installSpecifier] = `./${proxiedName}`;
            }
            else if (resolvedResult.type === 'DTS') {
                // This is fine! Skip type-only packages
                logger.debug(`[${installSpecifier}] target points to a TS-only package.`);
            }
        }
        catch (err) {
            if (skipFailures) {
                continue;
            }
            throw err;
        }
    }
    if (Object.keys(installEntrypoints).length === 0 && Object.keys(assetEntrypoints).length === 0) {
        throw new Error(`No ESM dependencies found!
${colors.dim(`  At least one dependency must have an ESM "module" entrypoint. You can find modern, web-ready packages at ${colors.underline('https://www.skypack.dev')}`)}`);
    }
    await es_module_lexer_1.init;
    let isFatalWarningFound = false;
    const inputOptions = {
        input: installEntrypoints,
        context: userDefinedRollup.context,
        external: (id) => external.some((packageName) => isImportOfPackage(id, packageName)),
        treeshake: { moduleSideEffects: true },
        plugins: [
            rollup_plugin_alias_1.rollupPluginAlias({
                entries: [
                    // Apply all aliases
                    ...Object.entries(installAlias).map(([key, val]) => ({
                        find: key,
                        replacement: val,
                        exact: false,
                    })),
                    // Make sure that internal imports also honor any resolved installEntrypoints
                    ...Object.entries(installEntrypoints).map(([key, val]) => ({
                        find: key,
                        replacement: val,
                        exact: true,
                    })),
                ],
            }),
            rollup_plugin_catch_fetch_1.rollupPluginCatchFetch(),
            plugin_node_resolve_1.default({
                mainFields: [...packageLookupFields, ...entrypoints_1.MAIN_FIELDS],
                extensions: ['.mjs', '.cjs', '.js', '.json'],
                // whether to prefer built-in modules (e.g. `fs`, `path`) or local ones with the same names
                preferBuiltins: true,
                dedupe: userDefinedRollup.dedupe || [],
                // @ts-ignore: Added in v11+ of this plugin
                exportConditions: packageExportLookupFields,
            }),
            plugin_json_1.default({
                preferConst: true,
                indent: '  ',
                compact: false,
                namedExports: true,
            }),
            rollup_plugin_css_1.rollupPluginCss(),
            plugin_replace_1.default({
                preventAssignment: true,
                values: generateReplacements(env),
            }),
            plugin_commonjs_1.default({
                extensions: ['.js', '.cjs'],
                esmExternals: Array.isArray(externalEsm)
                    ? (id) => externalEsm.some((packageName) => isImportOfPackage(id, packageName))
                    : externalEsm,
                requireReturnsDefault: 'auto',
            }),
            rollup_plugin_wrap_install_targets_1.rollupPluginWrapInstallTargets(!!isTreeshake, installTargets, logger),
            stats && rollup_plugin_stats_1.rollupPluginDependencyStats((info) => (dependencyStats = info)),
            rollup_plugin_node_process_polyfill_1.rollupPluginNodeProcessPolyfill(env),
            polyfillNode && rollup_plugin_polyfill_node_1.default(),
            ...(userDefinedRollup.plugins || []),
            rollup_plugin_catch_unresolved_1.rollupPluginCatchUnresolved(),
            rollup_plugin_strip_source_mapping_1.rollupPluginStripSourceMapping(),
        ].filter(Boolean),
        onwarn(warning) {
            // Log "unresolved" import warnings as an error, causing Snowpack to fail at the end.
            if (warning.code === 'PLUGIN_WARNING' &&
                warning.plugin === 'snowpack:rollup-plugin-catch-unresolved') {
                isFatalWarningFound = true;
                // Display posix-style on all environments, mainly to help with CI :)
                if (warning.id) {
                    logger.error(`${warning.id}\n   ${warning.message}`);
                }
                else {
                    logger.error(`${warning.message}. See https://www.snowpack.dev/reference/common-error-details`);
                }
                return;
            }
            const { loc, message } = warning;
            const logMessage = loc ? `${loc.file}:${loc.line}:${loc.column} ${message}` : message;
            // These warnings are usually harmless in packages, so don't show them by default.
            if (warning.code === 'CIRCULAR_DEPENDENCY' ||
                warning.code === 'NAMESPACE_CONFLICT' ||
                warning.code === 'THIS_IS_UNDEFINED' ||
                warning.code === 'EMPTY_BUNDLE' ||
                warning.code === 'UNUSED_EXTERNAL_IMPORT') {
                logger.debug(logMessage);
            }
            else {
                logger.warn(logMessage);
            }
        },
    };
    const outputOptions = {
        dir: destLoc,
        format: 'esm',
        sourcemap,
        exports: 'named',
        entryFileNames: (chunk) => {
            const targetName = util_1.getWebDependencyName(chunk.name);
            const proxiedName = util_1.sanitizePackageName(targetName);
            return `${proxiedName}.js`;
        },
        chunkFileNames: 'common/[name]-[hash].js',
    };
    rimraf_1.default.sync(destLoc);
    if (Object.keys(installEntrypoints).length > 0) {
        try {
            logger.debug(process.cwd());
            logger.debug(`running installer with options: ${JSON.stringify(inputOptions)}`);
            const packageBundle = await rollup_1.rollup(inputOptions);
            logger.debug(`installing npm packages: ${Object.keys(installEntrypoints).join(', ')}`);
            if (isFatalWarningFound) {
                // We don't know exactly which package failed because it happened in rollup
                // but users need all the information we *do know* in order to debug
                const packageName = Object.keys(installEntrypoints).length === 1
                    ? `for ${Object.keys(installEntrypoints)[0]}`
                    : `for one of ${Object.keys(installEntrypoints).join(', ')}`;
                throw new Error(FAILED_INSTALL_MESSAGE(packageName));
            }
            logger.debug(`writing install results to disk`);
            await packageBundle.write(outputOptions);
        }
        catch (_err) {
            logger.debug(`FAILURE: ${_err}`);
            const err = _err;
            if (err.code === 'MISSING_EXPORT') {
                let [exportSpecifier, tail] = err.message.split(' is not exported by ');
                exportSpecifier = exportSpecifier.slice(1, -1);
                const specifier = tail.split('imported by ')[1];
                let modName;
                for (const [key, value] of Object.entries(installEntrypoints)) {
                    if (value === specifier) {
                        modName = key;
                        break;
                    }
                }
                throw new Error(`Module "${modName}" has no exported member "${exportSpecifier}". Did you mean to use "import ${exportSpecifier} from '${modName}'" instead?`);
            }
            const errFilePath = ((_a = err.loc) === null || _a === void 0 ? void 0 : _a.file) || err.id;
            if (!errFilePath) {
                throw err;
            }
            // NOTE: Rollup will fail instantly on most errors. Therefore, we can
            // only report one error at a time. `err.watchFiles` also exists, but
            // for now `err.loc.file` and `err.id` have all the info that we need.
            const failedExtension = path_1.default.extname(errFilePath);
            const suggestion = util_1.MISSING_PLUGIN_SUGGESTIONS[failedExtension] || err.message;
            // Display posix-style on all environments, mainly to help with CI :)
            const fileName = path_1.default.relative(cwd, errFilePath).replace(/\\/g, '/');
            logger.error(`Failed to load ${colors.bold(fileName)}\n  ${suggestion}`);
            throw new Error(FAILED_INSTALL_MESSAGE());
        }
    }
    mkdirp_1.default.sync(destLoc);
    await util_1.writeLockfile(path_1.default.join(destLoc, 'import-map.json'), importMap);
    for (const [assetName, assetLoc] of Object.entries(assetEntrypoints)) {
        const assetDest = `${destLoc}/${util_1.sanitizePackageName(assetName)}`;
        mkdirp_1.default.sync(path_1.default.dirname(assetDest));
        fs_1.default.copyFileSync(assetLoc, assetDest);
    }
    return {
        importMap,
        stats: dependencyStats,
    };
}
exports.install = install;
//# sourceMappingURL=index.js.map