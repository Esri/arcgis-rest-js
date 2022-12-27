import * as colors from 'kleur/colors';
import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';
import { fdir } from 'fdir';
import mkdirp from 'mkdirp';
import path from 'path';
import picomatch from 'picomatch';
import slash from 'slash';
import { getUrlsForFile } from './file-urls';
import { runPipelineCleanupStep, runPipelineOptimizeStep } from './build-pipeline';
import { wrapImportProxy } from './build-import-proxy';
import { runBuiltInOptimize } from './optimize';
import { startServer } from '../commands/dev';
import { getPackageSource } from '../sources/util';
import { installPackages } from '../sources/local-install';
import { deleteFromBuildSafe, isPathImport, isRemoteUrl, IS_DOTFILE_REGEX } from '../util';
import { logger } from '../logger';
function getIsHmrEnabled(config) {
    return config.buildOptions.watch && !!config.devOptions.hmr;
}
/**
 * Scan a directory and remove any empty folders, recursively.
 */
async function removeEmptyFolders(directoryLoc) {
    if (!(await fs.stat(directoryLoc)).isDirectory()) {
        return false;
    }
    // If folder is empty, clear it
    const files = await fs.readdir(directoryLoc);
    if (files.length === 0) {
        await fs.rmdir(directoryLoc);
        return false;
    }
    // Otherwise, step in and clean each contained item
    await Promise.all(files.map((file) => removeEmptyFolders(path.join(directoryLoc, file))));
    // After, check again if folder is now empty
    const afterFiles = await fs.readdir(directoryLoc);
    if (afterFiles.length == 0) {
        await fs.rmdir(directoryLoc);
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
    const pkgSource = getPackageSource(commandOptions.config);
    const installOptions = await pkgSource.modifyBuildInstallOptions(baseInstallOptions, installTargets);
    // 2. Install dependencies, based on the scan of your final build.
    const installResult = await installPackages({
        config: commandOptions.config,
        isSSR: commandOptions.config.buildOptions.ssr,
        isDev: false,
        installTargets,
        installOptions,
    });
    return installResult;
}
export async function createBuildState(commandOptions) {
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
    const devServer = await startServer(commandOptions, { isDev, isWatch, preparePackages: false });
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
export function maybeCleanBuildDirectory(state) {
    const { buildDirectoryLoc } = state;
    if (state.clean) {
        deleteFromBuildSafe(buildDirectoryLoc, state.config);
    }
    mkdirp.sync(buildDirectoryLoc);
}
export async function addBuildFiles(state, files) {
    const { config } = state;
    const excludeGlobs = [...config.exclude, ...config.testOptions.files];
    const foundExcludeMatch = picomatch(excludeGlobs);
    const mountedNodeModules = Object.keys(config.mount).filter((v) => v.includes('node_modules'));
    const allFileUrls = [];
    for (const f of files) {
        if (foundExcludeMatch(f)) {
            const isMounted = mountedNodeModules.find((mountKey) => f.startsWith(mountKey));
            if (!isMounted || (isMounted && foundExcludeMatch(f.slice(isMounted.length)))) {
                continue;
            }
        }
        const fileUrls = getUrlsForFile(f, config);
        allFileUrls.push(...fileUrls);
    }
    state.allBareModuleSpecifiers = [];
    state.allFileUrlsUnique = new Set(allFileUrls);
    state.allFileUrlsToProcess = [...state.allFileUrlsUnique];
}
export async function addBuildFilesFromMountpoints(state) {
    const { config } = state;
    const possibleFiles = [];
    for (const [mountKey, mountEntry] of Object.entries(config.mount)) {
        logger.debug(`Mounting directory: '${mountKey}' as URL '${mountEntry.url}'`);
        const allMatchedFiles = (await new fdir()
            .withFullPaths()
            .crawl(mountKey)
            .withPromise());
        if (mountEntry.dot) {
            possibleFiles.push(...allMatchedFiles);
        }
        else {
            possibleFiles.push(...allMatchedFiles.filter((f) => !IS_DOTFILE_REGEX.test(slash(f)))); // TODO: use a file URL instead
        }
    }
    addBuildFiles(state, possibleFiles);
}
async function flushFileQueue(state, ignorePkg, loadOptions) {
    const { config, allFileUrlsUnique, allFileUrlsToProcess, allBareModuleSpecifiers, buildDirectoryLoc, devServer, isHMR, } = state;
    const pkgUrlPrefix = path.posix.join(config.buildOptions.metaUrlPath, 'pkg/');
    logger.debug(`QUEUE: ${allFileUrlsToProcess}`);
    while (allFileUrlsToProcess.length > 0) {
        const fileUrl = allFileUrlsToProcess.shift();
        const fileDestinationLoc = path.join(buildDirectoryLoc, fileUrl);
        logger.debug(`BUILD: ${fileUrl}`);
        // ignore package URLs when `ignorePkg` is true, EXCEPT proxy imports. Those can sometimes
        // be added after the intial package scan, depending on how a non-JS package is imported.
        if (ignorePkg && fileUrl.startsWith(pkgUrlPrefix)) {
            if (fileUrl.endsWith('.proxy.js')) {
                const pkgContents = await fs.readFile(path.join(buildDirectoryLoc, fileUrl.replace('.proxy.js', '')));
                const pkgContentsProxy = await wrapImportProxy({
                    url: fileUrl.replace('.proxy.js', ''),
                    code: pkgContents,
                    hmr: isHMR,
                    config: config,
                });
                await fs.writeFile(fileDestinationLoc, pkgContentsProxy);
            }
            continue;
        }
        const result = await devServer.loadUrl(fileUrl, loadOptions);
        if (!result) {
            // if this URL doesn’t exist, skip to next file (it may be an optional output type, such as .css for .svelte)
            logger.debug(`BUILD: ${fileUrl} skipped (no output)`);
            continue;
        }
        await mkdirp(path.dirname(fileDestinationLoc));
        await fs.writeFile(fileDestinationLoc, result.contents);
        for (const installTarget of result.imports) {
            const importedUrl = installTarget.specifier;
            logger.debug(`ADD: ${importedUrl}`);
            if (isRemoteUrl(importedUrl)) {
                // do nothing
            }
            else if (isPathImport(importedUrl)) {
                if (importedUrl[0] === '/') {
                    if (!allFileUrlsUnique.has(importedUrl)) {
                        allFileUrlsUnique.add(importedUrl);
                        allFileUrlsToProcess.push(importedUrl);
                    }
                }
                else {
                    logger.warn(`warn: import "${importedUrl}" of "${fileUrl}" could not be resolved.`);
                }
            }
            else {
                allBareModuleSpecifiers.push(installTarget);
            }
        }
    }
}
export async function buildFiles(state) {
    const { isSSR, isHMR } = state;
    logger.info(colors.yellow('! building files...'));
    const buildStart = performance.now();
    await flushFileQueue(state, false, { isSSR, isHMR, isResolve: false });
    const buildEnd = performance.now();
    logger.info(`${colors.green('✔')} files built. ${colors.dim(`[${((buildEnd - buildStart) / 1000).toFixed(2)}s]`)}`);
}
export async function buildDependencies(state) {
    const { commandOptions, config, buildDirectoryLoc, isWatch } = state;
    logger.info(colors.yellow('! building dependencies...'));
    const packagesStart = performance.now();
    if (isWatch) {
        const pkgSource = getPackageSource(config);
        await pkgSource.prepare();
    }
    else {
        const installDest = path.join(buildDirectoryLoc, config.buildOptions.metaUrlPath, 'pkg');
        const installResult = await installOptimizedDependencies([...state.allBareModuleSpecifiers], installDest, commandOptions);
        state.optimizedImportMap = installResult.importMap;
    }
    const packagesEnd = performance.now();
    logger.info(`${colors.green('✔')} dependencies built. ${colors.dim(`[${((packagesEnd - packagesStart) / 1000).toFixed(2)}s]`)}`);
}
export async function writeToDisk(state) {
    const { isHMR, isSSR, isWatch } = state;
    logger.info(colors.yellow('! writing to disk...'));
    const writeStart = performance.now();
    state.allFileUrlsToProcess = [...state.allFileUrlsUnique];
    await flushFileQueue(state, !isWatch, {
        isSSR,
        isHMR,
        isResolve: true,
        importMap: state.optimizedImportMap,
    });
    const writeEnd = performance.now();
    logger.info(`${colors.green('✔')} write complete. ${colors.dim(`[${((writeEnd - writeStart) / 1000).toFixed(2)}s]`)}`);
}
export async function startWatch(state) {
    const { config, devServer, isSSR, isHMR } = state;
    let onFileChangeCallback = () => { };
    devServer.onFileChange(async ({ filePath }) => {
        // First, do our own re-build logic
        const fileUrls = getUrlsForFile(filePath, config);
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
        logger.info(`${colors.green(`HMR ready:`)} ws://localhost:${devServer.hmrEngine.port}`);
    }
    return {
        onFileChange: (callback) => (onFileChangeCallback = callback),
        shutdown() {
            return devServer.shutdown();
        },
    };
}
export async function optimize(state) {
    const { config, buildDirectoryLoc } = state;
    // "--optimize" mode - Optimize the build.
    if (config.optimize || config.plugins.some((p) => p.optimize)) {
        const optimizeStart = performance.now();
        logger.info(colors.yellow('! optimizing build...'));
        await runBuiltInOptimize(config);
        await runPipelineOptimizeStep(buildDirectoryLoc, { config });
        const optimizeEnd = performance.now();
        logger.info(`${colors.green('✔')} build optimized. ${colors.dim(`[${((optimizeEnd - optimizeStart) / 1000).toFixed(2)}s]`)}`);
    }
}
export async function postBuildCleanup(state) {
    const { buildDirectoryLoc, config, devServer } = state;
    await removeEmptyFolders(buildDirectoryLoc);
    await runPipelineCleanupStep(config);
    logger.info(`${colors.underline(colors.green(colors.bold('▶ Build Complete!')))}`);
    await devServer.shutdown();
}
