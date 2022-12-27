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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postBuildCleanup = exports.optimize = exports.startWatch = exports.writeToDisk = exports.buildDependencies = exports.buildFiles = exports.addBuildFilesFromMountpoints = exports.addBuildFiles = exports.maybeCleanBuildDirectory = exports.createBuildState = void 0;
const colors = __importStar(require("kleur/colors"));
const fs_1 = require("fs");
const perf_hooks_1 = require("perf_hooks");
const fdir_1 = require("fdir");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const picomatch_1 = __importDefault(require("picomatch"));
const slash_1 = __importDefault(require("slash"));
const file_urls_1 = require("./file-urls");
const build_pipeline_1 = require("./build-pipeline");
const build_import_proxy_1 = require("./build-import-proxy");
const optimize_1 = require("./optimize");
const dev_1 = require("../commands/dev");
const util_1 = require("../sources/util");
const local_install_1 = require("../sources/local-install");
const util_2 = require("../util");
const logger_1 = require("../logger");
function getIsHmrEnabled(config) {
    return config.buildOptions.watch && !!config.devOptions.hmr;
}
/**
 * Scan a directory and remove any empty folders, recursively.
 */
async function removeEmptyFolders(directoryLoc) {
    if (!(await fs_1.promises.stat(directoryLoc)).isDirectory()) {
        return false;
    }
    // If folder is empty, clear it
    const files = await fs_1.promises.readdir(directoryLoc);
    if (files.length === 0) {
        await fs_1.promises.rmdir(directoryLoc);
        return false;
    }
    // Otherwise, step in and clean each contained item
    await Promise.all(files.map((file) => removeEmptyFolders(path_1.default.join(directoryLoc, file))));
    // After, check again if folder is now empty
    const afterFiles = await fs_1.promises.readdir(directoryLoc);
    if (afterFiles.length == 0) {
        await fs_1.promises.rmdir(directoryLoc);
    }
    return true;
}
async function installOptimizedDependencies(installTargets, installDest, commandOptions) {
    var _a;
    const baseInstallOptions = {
        dest: installDest,
        external: commandOptions.config.packageOptions.external,
        env: { NODE_ENV: commandOptions.config.mode },
        treeshake: commandOptions.config.buildOptions.watch
            ? false
            : ((_a = commandOptions.config.optimize) === null || _a === void 0 ? void 0 : _a.treeshake) !== false,
    };
    const pkgSource = util_1.getPackageSource(commandOptions.config);
    const installOptions = await pkgSource.modifyBuildInstallOptions(baseInstallOptions, installTargets);
    // 2. Install dependencies, based on the scan of your final build.
    const installResult = await local_install_1.installPackages({
        config: commandOptions.config,
        isSSR: commandOptions.config.buildOptions.ssr,
        isDev: false,
        installTargets,
        installOptions,
    });
    return installResult;
}
async function createBuildState(commandOptions) {
    var _a;
    const { config } = commandOptions;
    const isWatch = !!config.buildOptions.watch;
    const isDev = !!isWatch;
    const isSSR = !!config.buildOptions.ssr;
    const isHMR = getIsHmrEnabled(config);
    // Seems like maybe we shouldn't be doing this...
    config.buildOptions.resolveProxyImports = !((_a = config.optimize) === null || _a === void 0 ? void 0 : _a.bundle);
    config.devOptions.hmrPort = isHMR ? config.devOptions.hmrPort : undefined;
    config.devOptions.port = 0;
    const clean = config.buildOptions.clean;
    const buildDirectoryLoc = config.buildOptions.out;
    const devServer = await dev_1.startServer(commandOptions, { isDev, isWatch, preparePackages: false });
    return {
        commandOptions,
        config,
        isDev,
        isHMR,
        isSSR,
        isWatch,
        clean,
        buildDirectoryLoc,
        allBareModuleSpecifiers: [],
        allFileUrlsUnique: new Set(),
        allFileUrlsToProcess: [],
        devServer,
    };
}
exports.createBuildState = createBuildState;
function maybeCleanBuildDirectory(state) {
    const { buildDirectoryLoc } = state;
    if (state.clean) {
        util_2.deleteFromBuildSafe(buildDirectoryLoc, state.config);
    }
    mkdirp_1.default.sync(buildDirectoryLoc);
}
exports.maybeCleanBuildDirectory = maybeCleanBuildDirectory;
async function addBuildFiles(state, files) {
    const { config } = state;
    const excludeGlobs = [...config.exclude, ...config.testOptions.files];
    const foundExcludeMatch = picomatch_1.default(excludeGlobs);
    const mountedNodeModules = Object.keys(config.mount).filter((v) => v.includes('node_modules'));
    const allFileUrls = [];
    for (const f of files) {
        if (foundExcludeMatch(f)) {
            const isMounted = mountedNodeModules.find((mountKey) => f.startsWith(mountKey));
            if (!isMounted || (isMounted && foundExcludeMatch(f.slice(isMounted.length)))) {
                continue;
            }
        }
        const fileUrls = file_urls_1.getUrlsForFile(f, config);
        allFileUrls.push(...fileUrls);
    }
    state.allBareModuleSpecifiers = [];
    state.allFileUrlsUnique = new Set(allFileUrls);
    state.allFileUrlsToProcess = [...state.allFileUrlsUnique];
}
exports.addBuildFiles = addBuildFiles;
async function addBuildFilesFromMountpoints(state) {
    const { config } = state;
    const possibleFiles = [];
    for (const [mountKey, mountEntry] of Object.entries(config.mount)) {
        logger_1.logger.debug(`Mounting directory: '${mountKey}' as URL '${mountEntry.url}'`);
        const allMatchedFiles = (await new fdir_1.fdir()
            .withFullPaths()
            .crawl(mountKey)
            .withPromise());
        if (mountEntry.dot) {
            possibleFiles.push(...allMatchedFiles);
        }
        else {
            possibleFiles.push(...allMatchedFiles.filter((f) => !util_2.IS_DOTFILE_REGEX.test(slash_1.default(f)))); // TODO: use a file URL instead
        }
    }
    addBuildFiles(state, possibleFiles);
}
exports.addBuildFilesFromMountpoints = addBuildFilesFromMountpoints;
async function flushFileQueue(state, ignorePkg, loadOptions) {
    const { config, allFileUrlsUnique, allFileUrlsToProcess, allBareModuleSpecifiers, buildDirectoryLoc, devServer, isHMR, } = state;
    const pkgUrlPrefix = path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg/');
    logger_1.logger.debug(`QUEUE: ${allFileUrlsToProcess}`);
    while (allFileUrlsToProcess.length > 0) {
        const fileUrl = allFileUrlsToProcess.shift();
        const fileDestinationLoc = path_1.default.join(buildDirectoryLoc, fileUrl);
        logger_1.logger.debug(`BUILD: ${fileUrl}`);
        // ignore package URLs when `ignorePkg` is true, EXCEPT proxy imports. Those can sometimes
        // be added after the intial package scan, depending on how a non-JS package is imported.
        if (ignorePkg && fileUrl.startsWith(pkgUrlPrefix)) {
            if (fileUrl.endsWith('.proxy.js')) {
                const pkgContents = await fs_1.promises.readFile(path_1.default.join(buildDirectoryLoc, fileUrl.replace('.proxy.js', '')));
                const pkgContentsProxy = await build_import_proxy_1.wrapImportProxy({
                    url: fileUrl.replace('.proxy.js', ''),
                    code: pkgContents,
                    hmr: isHMR,
                    config: config,
                });
                await fs_1.promises.writeFile(fileDestinationLoc, pkgContentsProxy);
            }
            continue;
        }
        const result = await devServer.loadUrl(fileUrl, loadOptions);
        if (!result) {
            // if this URL doesn’t exist, skip to next file (it may be an optional output type, such as .css for .svelte)
            logger_1.logger.debug(`BUILD: ${fileUrl} skipped (no output)`);
            continue;
        }
        await mkdirp_1.default(path_1.default.dirname(fileDestinationLoc));
        await fs_1.promises.writeFile(fileDestinationLoc, result.contents);
        for (const installTarget of result.imports) {
            const importedUrl = installTarget.specifier;
            logger_1.logger.debug(`ADD: ${importedUrl}`);
            if (util_2.isRemoteUrl(importedUrl)) {
                // do nothing
            }
            else if (util_2.isPathImport(importedUrl)) {
                if (importedUrl[0] === '/') {
                    if (!allFileUrlsUnique.has(importedUrl)) {
                        allFileUrlsUnique.add(importedUrl);
                        allFileUrlsToProcess.push(importedUrl);
                    }
                }
                else {
                    logger_1.logger.warn(`warn: import "${importedUrl}" of "${fileUrl}" could not be resolved.`);
                }
            }
            else {
                allBareModuleSpecifiers.push(installTarget);
            }
        }
    }
}
async function buildFiles(state) {
    const { isSSR, isHMR } = state;
    logger_1.logger.info(colors.yellow('! building files...'));
    const buildStart = perf_hooks_1.performance.now();
    await flushFileQueue(state, false, { isSSR, isHMR, isResolve: false });
    const buildEnd = perf_hooks_1.performance.now();
    logger_1.logger.info(`${colors.green('✔')} files built. ${colors.dim(`[${((buildEnd - buildStart) / 1000).toFixed(2)}s]`)}`);
}
exports.buildFiles = buildFiles;
async function buildDependencies(state) {
    const { commandOptions, config, buildDirectoryLoc, isWatch } = state;
    logger_1.logger.info(colors.yellow('! building dependencies...'));
    const packagesStart = perf_hooks_1.performance.now();
    if (isWatch) {
        const pkgSource = util_1.getPackageSource(config);
        await pkgSource.prepare();
    }
    else {
        const installDest = path_1.default.join(buildDirectoryLoc, config.buildOptions.metaUrlPath, 'pkg');
        const installResult = await installOptimizedDependencies([...state.allBareModuleSpecifiers], installDest, commandOptions);
        state.optimizedImportMap = installResult.importMap;
    }
    const packagesEnd = perf_hooks_1.performance.now();
    logger_1.logger.info(`${colors.green('✔')} dependencies built. ${colors.dim(`[${((packagesEnd - packagesStart) / 1000).toFixed(2)}s]`)}`);
}
exports.buildDependencies = buildDependencies;
async function writeToDisk(state) {
    const { isHMR, isSSR, isWatch } = state;
    logger_1.logger.info(colors.yellow('! writing to disk...'));
    const writeStart = perf_hooks_1.performance.now();
    state.allFileUrlsToProcess = [...state.allFileUrlsUnique];
    await flushFileQueue(state, !isWatch, {
        isSSR,
        isHMR,
        isResolve: true,
        importMap: state.optimizedImportMap,
    });
    const writeEnd = perf_hooks_1.performance.now();
    logger_1.logger.info(`${colors.green('✔')} write complete. ${colors.dim(`[${((writeEnd - writeStart) / 1000).toFixed(2)}s]`)}`);
}
exports.writeToDisk = writeToDisk;
async function startWatch(state) {
    const { config, devServer, isSSR, isHMR } = state;
    let onFileChangeCallback = () => { };
    devServer.onFileChange(async ({ filePath }) => {
        // First, do our own re-build logic
        const fileUrls = file_urls_1.getUrlsForFile(filePath, config);
        if (!fileUrls || fileUrls.length === 0) {
            return;
        }
        state.allFileUrlsToProcess.push(fileUrls[0]);
        await flushFileQueue(state, false, {
            isSSR,
            isHMR,
            isResolve: true,
            importMap: state.optimizedImportMap,
        });
        // Then, call the user's onFileChange callback (if one was provided)
        await onFileChangeCallback({ filePath });
    });
    if (devServer.hmrEngine) {
        logger_1.logger.info(`${colors.green(`HMR ready:`)} ws://localhost:${devServer.hmrEngine.port}`);
    }
    return {
        onFileChange: (callback) => (onFileChangeCallback = callback),
        shutdown() {
            return devServer.shutdown();
        },
    };
}
exports.startWatch = startWatch;
async function optimize(state) {
    const { config, buildDirectoryLoc } = state;
    // "--optimize" mode - Optimize the build.
    if (config.optimize || config.plugins.some((p) => p.optimize)) {
        const optimizeStart = perf_hooks_1.performance.now();
        logger_1.logger.info(colors.yellow('! optimizing build...'));
        await optimize_1.runBuiltInOptimize(config);
        await build_pipeline_1.runPipelineOptimizeStep(buildDirectoryLoc, { config });
        const optimizeEnd = perf_hooks_1.performance.now();
        logger_1.logger.info(`${colors.green('✔')} build optimized. ${colors.dim(`[${((optimizeEnd - optimizeStart) / 1000).toFixed(2)}s]`)}`);
    }
}
exports.optimize = optimize;
async function postBuildCleanup(state) {
    const { buildDirectoryLoc, config, devServer } = state;
    await removeEmptyFolders(buildDirectoryLoc);
    await build_pipeline_1.runPipelineCleanupStep(config);
    logger_1.logger.info(`${colors.underline(colors.green(colors.bold('▶ Build Complete!')))}`);
    await devServer.shutdown();
}
exports.postBuildCleanup = postBuildCleanup;
