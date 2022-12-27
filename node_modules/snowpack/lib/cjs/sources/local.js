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
exports.PackageSourceLocal = void 0;
const arborist_1 = __importDefault(require("@npmcli/arborist"));
const esinstall_1 = require("esinstall");
const find_up_1 = __importDefault(require("find-up"));
const fs_1 = require("fs");
const colors = __importStar(require("kleur/colors"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const pacote_1 = __importDefault(require("pacote"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const slash_1 = __importDefault(require("slash"));
const file_urls_1 = require("../build/file-urls");
const logger_1 = require("../logger");
const rewrite_imports_1 = require("../rewrite-imports");
const scan_imports_1 = require("../scan-imports");
const util_1 = require("../util");
const util_2 = require("./util");
const local_install_1 = require("./local-install");
const CURRENT_META_FILE_CONTENTS = `.snowpack cache - Do not edit this directory!

The ".snowpack" cache directory is fully managed for you by Snowpack.
Manual changes that you make to the files inside could break things.

Commit this directory to source control to speed up cold starts.

Found an issue? You can always delete the ".snowpack"
directory and Snowpack will recreate it on next run.

[.meta.version=2]`;
const NEVER_PEER_PACKAGES = new Set([
    '@babel/runtime',
    '@babel/runtime-corejs3',
    'babel-runtime',
    'dom-helpers',
    'es-abstract',
    'node-fetch',
    'whatwg-fetch',
    'tslib',
    '@ant-design/icons-svg',
    '@ant-design/icons',
]);
function isPackageCJS(manifest) {
    var _a;
    return (
    // If a "module" entrypoint is defined, we'll use that.
    !manifest.module &&
        // If "type":"module", assume ESM.
        manifest.type !== 'module' &&
        // If export map exists, assume ESM exists somewhere within it.
        !manifest.exports &&
        // If "main" exists and ends in ".mjs", assume ESM.
        !((_a = manifest.main) === null || _a === void 0 ? void 0 : _a.endsWith('.mjs')));
}
function getRootPackageDirectory(loc) {
    const parts = loc.split('node_modules');
    if (parts.length === 1) {
        return undefined;
    }
    const packageParts = parts.pop().split(path_1.default.sep).filter(Boolean);
    const packageRoot = path_1.default.join(parts.join('node_modules'), 'node_modules');
    if (packageParts[0].startsWith('@')) {
        return path_1.default.join(packageRoot, packageParts[0], packageParts[1]);
    }
    else {
        return path_1.default.join(packageRoot, packageParts[0]);
    }
}
/**
 * Return your source config, in object format. pacote, arborist, and cacahe
 * all support the same set of options here for configuring your npm registry.
 */
function getNpmConnectionOptions(source) {
    if (source === 'local' || source === 'remote-next') {
        return {};
    }
    else if (typeof source === 'string') {
        return { registry: source };
    }
    else {
        return source;
    }
}
class PackageSourceLocal {
    constructor(config) {
        this.memoizedResolve = {};
        this.memoizedImportMap = {};
        this.allPackageImports = {};
        this.allSymlinkImports = {};
        this.allKnownSpecs = new Set();
        this.allKnownProjectSpecs = new Set();
        this.hasWorkspaceWarningFired = false;
        this.config = config;
        this.npmConnectionOptions = getNpmConnectionOptions(config.packageOptions.source);
        if (config.packageOptions.source === 'local') {
            this.cacheDirectory = config.buildOptions.cacheDirPath
                ? path_1.default.resolve(config.buildOptions.cacheDirPath)
                : util_2.GLOBAL_CACHE_DIR;
            this.packageSourceDirectory = config.root;
            this.arb = null;
        }
        else {
            this.cacheDirectory = path_1.default.join(config.root, '.snowpack');
            this.packageSourceDirectory = path_1.default.join(config.root, '.snowpack', 'source');
            this.arb = new arborist_1.default({
                ...this.npmConnectionOptions,
                path: this.packageSourceDirectory,
                packageLockOnly: true,
            });
        }
    }
    async setupCacheDirectory() {
        const { config, packageSourceDirectory, cacheDirectory } = this;
        const lockfileLoc = path_1.default.join(cacheDirectory, 'lock.json');
        const manifestLoc = path_1.default.join(packageSourceDirectory, 'package.json');
        const manifestLockLoc = path_1.default.join(packageSourceDirectory, 'package-lock.json');
        await mkdirp_1.default(packageSourceDirectory);
        if (config.dependencies) {
            await fs_1.promises.writeFile(path_1.default.join(packageSourceDirectory, 'package.json'), JSON.stringify({
                '//': 'snowpack-mananged meta file. Do not edit this file!',
                dependencies: config.dependencies,
            }, null, 2), 'utf8');
            if (fs_1.existsSync(lockfileLoc)) {
                const lockfile = await fs_1.promises.readFile(lockfileLoc);
                await fs_1.promises.writeFile(manifestLockLoc, lockfile);
            }
            else {
                if (fs_1.existsSync(manifestLockLoc))
                    await fs_1.promises.unlink(manifestLockLoc);
            }
        }
        else {
            if (fs_1.existsSync(manifestLoc))
                await fs_1.promises.unlink(manifestLoc);
            if (fs_1.existsSync(manifestLockLoc))
                await fs_1.promises.unlink(manifestLockLoc);
        }
    }
    async setupPackageRootDirectory(installTargets) {
        const { arb, config } = this;
        const result = await arb.loadVirtual().catch(() => null);
        const packageNamesNeedInstall = new Set(installTargets
            .map((spec) => {
            let [_packageName] = util_1.parsePackageImportSpecifier(spec.specifier);
            // handle aliases
            const aliasEntry = util_1.findMatchingAliasEntry(config, _packageName);
            if (aliasEntry && aliasEntry.type === 'package') {
                const { from, to } = aliasEntry;
                _packageName = _packageName.replace(from, to);
            }
            if (!config.dependencies[_packageName]) {
                return _packageName;
            }
            // Needed to make TS happy. Gets filtered out in next step.
            return '';
        })
            .filter(Boolean));
        const needsInstall = result
            ? [...packageNamesNeedInstall].every((name) => !result.children.get(name))
            : true;
        if (needsInstall) {
            await arb.buildIdealTree({ add: [...packageNamesNeedInstall] });
            await arb.reify();
            const savedPackageLockfileLoc = path_1.default.join(this.packageSourceDirectory, 'package-lock.json');
            const savedPackageLockfile = await fs_1.promises.readFile(savedPackageLockfileLoc);
            await fs_1.promises.writeFile(path_1.default.join(this.cacheDirectory, 'lock.json'), savedPackageLockfile);
        }
    }
    async prepare() {
        const installDirectoryHashLoc = path_1.default.join(this.cacheDirectory, '.meta');
        const installDirectoryHash = fs_1.existsSync(installDirectoryHashLoc)
            ? await fs_1.promises.readFile(installDirectoryHashLoc, 'utf8')
            : undefined;
        if (installDirectoryHash === CURRENT_META_FILE_CONTENTS) {
            logger_1.logger.debug(`Install directory ".meta" file is up-to-date. Welcome back!`);
        }
        else if (installDirectoryHash) {
            logger_1.logger.info('Snowpack updated! Rebuilding your dependencies for the latest version of Snowpack...');
            await this.clearCache();
        }
        else {
            logger_1.logger.info(`${colors.bold('Welcome to Snowpack!')} Because this is your first time running\n` +
                `this project, Snowpack needs to prepare your dependencies. This is a one-time step\n` +
                `and the results will be cached for the lifetime of your project. Please wait...`);
        }
        const { config } = this;
        // If we're managing the the packages directory, setup some basic files.
        if (config.packageOptions.source !== 'local') {
            await this.setupCacheDirectory();
        }
        // Scan your project for imports.
        const installTargets = await scan_imports_1.getInstallTargets(config, config.packageOptions.knownEntrypoints);
        this.allKnownProjectSpecs = new Set(installTargets.map((t) => t.specifier));
        const allKnownPackageNames = new Set([
            ...[...this.allKnownProjectSpecs].map((spec) => util_1.parsePackageImportSpecifier(spec)[0]),
            ...Object.keys(config.dependencies),
        ]);
        // If we're managing the the packages directory, lookup & resolve the packages.
        if (config.packageOptions.source !== 'local') {
            await this.setupPackageRootDirectory(installTargets);
            await Promise.all([...allKnownPackageNames].map((packageName) => this.installPackage(packageName)));
        }
        for (const spec of this.allKnownProjectSpecs) {
            await this.buildPackageImport(spec);
        }
        // Save some metdata. Useful for next time.
        await mkdirp_1.default(path_1.default.dirname(installDirectoryHashLoc));
        await fs_1.promises.writeFile(installDirectoryHashLoc, CURRENT_META_FILE_CONTENTS, 'utf-8');
        return;
    }
    async prepareSingleFile(fileLoc) {
        const { config, allKnownProjectSpecs } = this;
        // get install targets (imports) for a single file.
        const installTargets = await scan_imports_1.getInstallTargets(config, config.packageOptions.knownEntrypoints, [
            {
                baseExt: util_1.getExtension(fileLoc),
                root: config.root,
                locOnDisk: fileLoc,
                contents: await util_1.readFile(fileLoc),
            },
        ]);
        // Filter out all known imports, we're only looking for new ones.
        const newImports = installTargets.filter((t) => !allKnownProjectSpecs.has(t.specifier));
        // Build all new package imports.
        for (const spec of newImports) {
            await this.buildPackageImport(spec.specifier);
            allKnownProjectSpecs.add(spec.specifier);
        }
    }
    async load(id, { isSSR } = {}) {
        const { config, allPackageImports } = this;
        const packageImport = allPackageImports[id];
        if (!packageImport) {
            return;
        }
        const { loc, entrypoint, packageName, packageVersion } = packageImport;
        let { installDest } = packageImport;
        if (isSSR && fs_1.existsSync(installDest + '-ssr')) {
            installDest += '-ssr';
        }
        let packageCode = await fs_1.promises.readFile(loc, 'utf8');
        const imports = [];
        const type = path_1.default.extname(loc);
        if (!(type === '.js' || type === '.html' || type === '.css')) {
            return { contents: packageCode, imports };
        }
        const packageImportMap = JSON.parse(await fs_1.promises.readFile(path_1.default.join(installDest, 'import-map.json'), 'utf8'));
        const resolveImport = async (spec) => {
            if (util_1.isRemoteUrl(spec)) {
                return spec;
            }
            if (spec.startsWith('/')) {
                return spec;
            }
            // These are a bit tricky: relative paths within packages always point to
            // relative files within the built package (ex: 'pkg/common/XXX-hash.js`).
            // We resolve these to a new kind of "internal" import URL that's different
            // from the normal, flattened URL for public imports.
            if (util_1.isPathImport(spec)) {
                const newLoc = path_1.default.resolve(path_1.default.dirname(loc), spec);
                const resolvedSpec = slash_1.default(path_1.default.relative(installDest, newLoc));
                const publicImportEntry = Object.entries(packageImportMap.imports).find(([, v]) => v === './' + resolvedSpec);
                // If this matches the destination of a public package import, resolve to it.
                if (publicImportEntry) {
                    spec = publicImportEntry[0];
                    return await this.resolvePackageImport(spec, { source: entrypoint });
                }
                // Otherwise, create a relative import ID for the internal file.
                const relativeImportId = path_1.default.posix.join(`${packageName}.v${packageVersion}`, resolvedSpec);
                this.allPackageImports[relativeImportId] = {
                    entrypoint: path_1.default.join(installDest, 'package.json'),
                    loc: newLoc,
                    installDest,
                    packageVersion,
                    packageName,
                };
                return path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg', relativeImportId);
            }
            // Otherwise, resolve this specifier as an external package.
            return await this.resolvePackageImport(spec, { source: entrypoint });
        };
        packageCode = await rewrite_imports_1.transformFileImports({ type, contents: packageCode }, async (spec) => {
            let resolvedImportUrl = await resolveImport(spec);
            const importExtName = path_1.default.posix.extname(resolvedImportUrl);
            const isProxyImport = importExtName && importExtName !== '.js' && importExtName !== '.mjs';
            if (config.buildOptions.resolveProxyImports && isProxyImport) {
                resolvedImportUrl = resolvedImportUrl + '.proxy.js';
            }
            imports.push(util_1.createInstallTarget(path_1.default.resolve(path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg', id), resolvedImportUrl)));
            return resolvedImportUrl;
        });
        return { contents: packageCode, imports };
    }
    async modifyBuildInstallOptions(installOptions, installTargets) {
        const config = this.config;
        if (config.packageOptions.source === 'remote') {
            return installOptions;
        }
        installOptions.cwd = config.root;
        installOptions.rollup = config.packageOptions.rollup;
        installOptions.sourcemap = config.buildOptions.sourcemap;
        installOptions.polyfillNode = config.packageOptions.polyfillNode;
        installOptions.packageLookupFields = config.packageOptions.packageLookupFields;
        installOptions.packageExportLookupFields = config.packageOptions.packageExportLookupFields;
        if (config.packageOptions.source === 'local') {
            return installOptions;
        }
        installOptions.cwd = this.packageSourceDirectory;
        await this.setupCacheDirectory();
        await this.setupPackageRootDirectory(installTargets);
        const buildArb = new arborist_1.default({
            ...this.npmConnectionOptions,
            path: this.packageSourceDirectory,
        });
        await buildArb.buildIdealTree();
        await buildArb.reify();
        return installOptions;
    }
    async resolveArbNode(packageName, source) {
        const { config, arb } = this;
        if (config.packageOptions.source === 'local') {
            return false;
        }
        const lookupStr = path_1.default.relative(this.packageSourceDirectory, source);
        const lookupParts = lookupStr.split(path_1.default.sep);
        let lookupNode = arb.actualTree || arb.virtualTree;
        let exactLookupNode = lookupNode;
        // Use the souce file path to travel the dependency tree,
        // looking for the most specific match for packageName.
        while (lookupNode && lookupNode.children && lookupParts.length > 0) {
            const part = lookupParts.shift();
            if (part !== 'node_modules') {
                continue;
            }
            let lookupPackageName = lookupParts.shift();
            if (lookupPackageName.startsWith('@')) {
                lookupPackageName += '/' + lookupParts.shift();
            }
            lookupNode = lookupNode.children.get(lookupPackageName);
            if (lookupNode && lookupNode.children.has(packageName)) {
                exactLookupNode = lookupNode;
            }
        }
        // If no nested match was found, exactLookupNode is still the root node.
        return exactLookupNode.children.get(packageName);
    }
    async installPackage(packageName, _source) {
        const { config, arb } = this;
        const source = _source || this.packageSourceDirectory;
        if (config.packageOptions.source === 'local') {
            return false;
        }
        const arbNode = await this.resolveArbNode(packageName, source);
        if (!arbNode) {
            await arb.buildIdealTree({ add: [packageName] });
            await arb.reify();
            // TODO: log this to the user somehow? Tell them to add the new package to dependencies obj?
            const savedPackageLockfileLoc = path_1.default.join(this.packageSourceDirectory, 'package-lock.json');
            const savedPackageLockfile = await fs_1.promises.readFile(savedPackageLockfileLoc, 'utf-8');
            await fs_1.promises.writeFile(path_1.default.join(this.cacheDirectory, 'lock.json'), savedPackageLockfile);
            // Retry.
            return this.installPackage(packageName, source);
        }
        if (fs_1.existsSync(arbNode.path)) {
            return false;
        }
        await pacote_1.default.extract(arbNode.resolved, arbNode.path, this.npmConnectionOptions);
        return true;
    }
    async buildPackageImport(spec, _source, logLine = false, depth = 0) {
        const { config, memoizedResolve, memoizedImportMap, allKnownSpecs, allPackageImports } = this;
        const source = _source || this.packageSourceDirectory;
        const aliasEntry = util_1.findMatchingAliasEntry(config, spec);
        if (aliasEntry && aliasEntry.type === 'package') {
            const { from, to } = aliasEntry;
            spec = spec.replace(from, to);
        }
        const [_packageName] = util_1.parsePackageImportSpecifier(spec);
        // Before doing anything, check for symlinks because symlinks shouldn't be built.
        try {
            const entrypoint = esinstall_1.resolveEntrypoint(spec, {
                cwd: source,
                packageLookupFields: [
                    'snowpack:source',
                    ...(config.packageOptions.packageLookupFields || []),
                ],
            });
            const isSymlink = !entrypoint.includes(path_1.default.join('node_modules', _packageName));
            if (isSymlink) {
                return;
            }
        }
        catch (err) {
            // that's fine, package just doesn't exist yet. Go download it.
        }
        // Check to see if this package is marked as external, in which case skip the build.
        if (this.isExternal(_packageName, spec)) {
            return;
        }
        await this.installPackage(_packageName, source);
        const entrypoint = esinstall_1.resolveEntrypoint(spec, {
            cwd: source,
            packageLookupFields: [
                'snowpack:source',
                ...(config.packageOptions.packageLookupFields || []),
            ],
        });
        // if this has already been memoized, exit
        if (memoizedResolve[entrypoint])
            return memoizedResolve[entrypoint];
        let rootPackageDirectory = getRootPackageDirectory(entrypoint);
        if (!rootPackageDirectory) {
            const rootPackageManifestLoc = await find_up_1.default('package.json', { cwd: entrypoint });
            if (!rootPackageManifestLoc) {
                throw new Error(`Error resolving import ${spec}: No parent package.json found.`);
            }
            rootPackageDirectory = path_1.default.dirname(rootPackageManifestLoc);
        }
        const packageManifestLoc = path_1.default.join(rootPackageDirectory, 'package.json');
        const packageManifestStr = await fs_1.promises.readFile(packageManifestLoc, 'utf8');
        const packageManifest = JSON.parse(packageManifestStr);
        const packageName = packageManifest.name || _packageName;
        const packageVersion = packageManifest.version || 'unknown';
        const packageUID = packageName + '@' + packageVersion;
        const installDest = path_1.default.join(this.cacheDirectory, 'build', packageUID);
        const isKnownSpec = allKnownSpecs.has(`${packageUID}:${spec}`);
        allKnownSpecs.add(`${packageUID}:${spec}`);
        // NOTE(@fks): This build step used to use a queue system, which allowed multiple
        // parallel builds at once. Unfortunately, these builds are compute heavy and not well
        // parallelized, so the queue was removed but the standalone inline function remains.
        const newImportMap = await (async () => {
            // Look up the import map of the already-installed package.
            // If spec already exists, then this import map is valid.
            const lineBullet = colors.dim(depth === 0 ? '+' : '└──'.padStart(depth * 2 + 1, ' '));
            let packageFormatted = spec + colors.dim('@' + packageVersion);
            const existingImportMapLoc = path_1.default.join(installDest, 'import-map.json');
            let existingImportMap = memoizedImportMap[packageName];
            if (!existingImportMap) {
                // note: this must happen BEFORE the check on disk to prevent a race condition.
                // If two lookups occur at once from different sources, then we mark this as “taken” immediately and finish the lookup async
                memoizedImportMap[packageName] = { imports: {} }; // TODO: this may not exist; should we throw an error?
                try {
                    const importMapHandle = await fs_1.promises.open(existingImportMapLoc, 'r+');
                    if (importMapHandle) {
                        const importMapData = await importMapHandle.readFile('utf8');
                        existingImportMap = importMapData ? JSON.parse(importMapData) : null;
                        memoizedImportMap[packageName] = existingImportMap;
                        await importMapHandle.close();
                    }
                }
                catch (err) {
                    delete memoizedImportMap[packageName]; // if there was trouble reading this, free up memoization
                }
            }
            // Kick off a build, if needed.
            let importMap = existingImportMap;
            let needsBuild = !(existingImportMap === null || existingImportMap === void 0 ? void 0 : existingImportMap.imports[spec]);
            if (logLine || (depth === 0 && (!importMap || needsBuild))) {
                logLine = true;
                // TODO: We need to confirm version match, not just package import match
                const isDedupe = depth > 0 && (isKnownSpec || this.allKnownProjectSpecs.has(spec));
                logger_1.logger.info(`${lineBullet} ${packageFormatted}${isDedupe ? colors.dim(` (dedupe)`) : ''}`);
            }
            if (!importMap || needsBuild) {
                const installTargets = [...allKnownSpecs]
                    .filter((spec) => spec.startsWith(packageUID))
                    .map((spec) => spec.substr(packageUID.length + 1));
                // TODO: external should be a function in esinstall
                const filteredExternal = (external) => external !== _packageName && !NEVER_PEER_PACKAGES.has(external);
                const dependenciesAndPeerDependencies = Object.keys(packageManifest.dependencies || {}).concat(Object.keys(packageManifest.peerDependencies || {}));
                const devDependencies = Object.keys(packageManifest.devDependencies || {});
                // Packages that should be marked as externalized. Any dependency
                // or peerDependency that is not one of the packages we want to always bundle
                const externalPackages = config.packageOptions.external.concat(dependenciesAndPeerDependencies.filter(filteredExternal));
                // The same as above, but includes devDependencies.
                const externalPackagesFull = externalPackages.concat(devDependencies.filter(filteredExternal));
                // To improve our ESM<>CJS conversion, we need to know the status of all dependencies.
                // This function returns a function, which can be used to fetch package.json manifests.
                // - When source = "local", this happens on the local file system (/w memoization).
                // - When source = "remote-next", this happens via remote manifest fetching (/w pacote caching).
                const getMemoizedResolveDependencyManifest = async () => {
                    const results = {};
                    if (config.packageOptions.source === 'local') {
                        return (packageName) => {
                            results[packageName] =
                                results[packageName] ||
                                    esinstall_1.resolveDependencyManifest(packageName, rootPackageDirectory)[1];
                            return results[packageName];
                        };
                    }
                    await Promise.all(externalPackages.map(async (externalPackage) => {
                        const arbNode = await this.resolveArbNode(externalPackage, rootPackageDirectory);
                        results[arbNode.name] = await pacote_1.default.manifest(`${arbNode.name}@${arbNode.version}`, {
                            ...this.npmConnectionOptions,
                            fullMetadata: true,
                        });
                    }));
                    return (packageName) => {
                        return results[packageName];
                    };
                };
                const resolveDependencyManifest = await getMemoizedResolveDependencyManifest();
                const installOptions = {
                    dest: installDest,
                    cwd: packageManifestLoc,
                    // This installer is only ever run in development. In production, many packages
                    // are installed together to take advantage of tree-shaking and package bundling.
                    env: { NODE_ENV: this.config.mode },
                    treeshake: false,
                    sourcemap: config.buildOptions.sourcemap,
                    alias: config.alias,
                    external: externalPackagesFull,
                    // ESM<>CJS Compatability: If we can detect that a dependency is common.js vs. ESM, then
                    // we can provide this hint to esinstall to improve our cross-package import support.
                    externalEsm: (imp) => {
                        const [packageName] = util_1.parsePackageImportSpecifier(imp);
                        const result = resolveDependencyManifest(packageName);
                        return !result || !isPackageCJS(result);
                    },
                };
                if (config.packageOptions.source === 'local') {
                    if (config.packageOptions.polyfillNode !== undefined) {
                        installOptions.polyfillNode = config.packageOptions.polyfillNode;
                    }
                    if (config.packageOptions.packageLookupFields !== undefined) {
                        installOptions.packageLookupFields = config.packageOptions.packageLookupFields;
                    }
                    if (config.packageOptions.namedExports !== undefined) {
                        installOptions.namedExports = config.packageOptions.namedExports;
                    }
                    if (config.packageOptions.rollup !== undefined) {
                        installOptions.rollup = config.packageOptions.rollup;
                    }
                }
                const installResult = await local_install_1.installPackages({
                    config,
                    isDev: true,
                    isSSR: false,
                    installTargets,
                    installOptions,
                });
                logger_1.logger.debug(`${lineBullet} ${packageFormatted} DONE`);
                if (installResult.needsSsrBuild) {
                    logger_1.logger.info(`${lineBullet} ${packageFormatted} ${colors.dim(`(ssr)`)}`);
                    await local_install_1.installPackages({
                        config,
                        isDev: true,
                        isSSR: true,
                        installTargets,
                        installOptions: {
                            ...installOptions,
                            dest: installDest + '-ssr',
                        },
                    });
                    logger_1.logger.debug(`${lineBullet} ${packageFormatted} (ssr) DONE`);
                }
                importMap = installResult.importMap;
            }
            const dependencyFileLoc = path_1.default.join(installDest, importMap.imports[spec]);
            const loadedFile = await fs_1.promises.readFile(dependencyFileLoc);
            if (util_1.isJavaScript(dependencyFileLoc)) {
                const newPackageImports = new Set();
                const code = loadedFile.toString('utf8');
                for (const imp of await rewrite_imports_1.scanCodeImportsExports(code)) {
                    let spec = scan_imports_1.getWebModuleSpecifierFromCode(code, imp);
                    if (spec === null) {
                        continue;
                    }
                    // remove trailing slash from end of specifier (easier for Node to resolve)
                    spec = spec.replace(/(\/|\\)+$/, '');
                    if (util_1.isRemoteUrl(spec)) {
                        continue; // ignore remote files
                    }
                    if (util_1.isPathImport(spec)) {
                        continue;
                    }
                    const [scannedPackageName] = util_1.parsePackageImportSpecifier(spec);
                    if (scannedPackageName && memoizedImportMap[scannedPackageName]) {
                        continue; // if we’ve already installed this, then don’t reinstall
                    }
                    newPackageImports.add(spec);
                }
                for (const packageImport of newPackageImports) {
                    await this.buildPackageImport(packageImport, entrypoint, logLine, depth + 1);
                }
            }
            return importMap;
        })();
        const dependencyFileLoc = path_1.default.join(installDest, newImportMap.imports[spec]);
        // Flatten the import map value into a resolved, public import ID.
        // ex: "./react.js" -> "react.v17.0.1.js"
        const importId = newImportMap.imports[spec]
            .replace(/\//g, '.')
            .replace(/^\.+/g, '')
            .replace(/\.([^\.]*?)$/, `.v${packageVersion}.$1`);
        allPackageImports[importId] = {
            entrypoint,
            loc: dependencyFileLoc,
            installDest,
            packageName,
            packageVersion,
        };
        // Memoize the result, for faster runtime lookups.
        memoizedResolve[entrypoint] = importId;
        return memoizedResolve[entrypoint];
    }
    async resolvePackageImport(_spec, options = {}) {
        const { config, memoizedResolve, allSymlinkImports } = this;
        const source = options.source || this.packageSourceDirectory;
        let spec = _spec;
        const aliasEntry = util_1.findMatchingAliasEntry(config, spec);
        if (aliasEntry && aliasEntry.type === 'package') {
            const { from, to } = aliasEntry;
            spec = spec.replace(from, to);
        }
        const [packageName] = util_1.parsePackageImportSpecifier(spec);
        // If this import is marked as external, do not transform the original spec
        if (this.isExternal(packageName, spec)) {
            return spec;
        }
        const entrypoint = esinstall_1.resolveEntrypoint(spec, {
            cwd: source,
            packageLookupFields: [
                'snowpack:source',
                ...(config.packageOptions.packageLookupFields || []),
            ],
        });
        // Imports in the same project should never change once resolved. Check the memoized cache here to speed up faster repeat page loads.
        // NOTE(fks): This is mainly needed because `resolveEntrypoint` can be slow and blocking, which creates issues when many files
        // are loaded/resolved at once (ex: antd). If we can improve the performance there and make that async, this may no longer be
        // necessary.
        if (!options.importMap) {
            if (memoizedResolve[entrypoint]) {
                return path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg', memoizedResolve[entrypoint]);
            }
        }
        const isSymlink = !entrypoint.includes(path_1.default.join('node_modules', packageName));
        const isWithinRoot = config.workspaceRoot && entrypoint.startsWith(config.workspaceRoot);
        if (isSymlink && config.workspaceRoot && isWithinRoot) {
            const builtEntrypointUrls = file_urls_1.getBuiltFileUrls(entrypoint, config);
            const builtEntrypointUrl = slash_1.default(path_1.default.relative(config.workspaceRoot, builtEntrypointUrls[0]));
            allSymlinkImports[builtEntrypointUrl] = entrypoint;
            return path_1.default.posix.join(config.buildOptions.metaUrlPath, 'link', builtEntrypointUrl);
        }
        else if (isSymlink && config.workspaceRoot !== false && !this.hasWorkspaceWarningFired) {
            this.hasWorkspaceWarningFired = true;
            logger_1.logger.warn(colors.bold(`${spec}: Locally linked package detected outside of project root.\n`) +
                `If you are working in a workspace/monorepo, set your snowpack.config.js "workspaceRoot" to your workspace\n` +
                `directory to take advantage of fast HMR updates for linked packages. Otherwise, this package will be\n` +
                `cached until its package.json "version" changes. To silence this warning, set "workspaceRoot: false".`);
        }
        if (options.importMap) {
            if (options.importMap.imports[spec]) {
                return path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg', options.importMap.imports[spec]);
            }
            throw new Error(`Unexpected: spec ${spec} not included in import map.`);
        }
        // Unscanned package imports can happen. Warn the user, and then build the import individually.
        logger_1.logger.warn(colors.bold(`${spec}: Unscannable package import found.\n`) +
            `Snowpack scans source files for package imports at startup, and on every change.\n` +
            `But, sometimes an import gets added during the build process, invisible to our file scanner.\n` +
            `We'll prepare this package for you now, but should add "${spec}" to "knownEntrypoints"\n` +
            `in your config file so that this gets prepared with the rest of your imports during startup.`);
        // Built the new import, and then try resolving again.
        if (options.isRetry) {
            throw new Error(`Unexpected: Unscanned package import "${spec}" couldn't be built/resolved.`);
        }
        await this.buildPackageImport(_spec, options.source, true);
        return this.resolvePackageImport(_spec, { source: options.source, isRetry: true });
    }
    clearCache() {
        return rimraf_1.default.sync(this.cacheDirectory);
    }
    getCacheFolder() {
        return this.cacheDirectory;
    }
    isExternal(packageName, specifier) {
        const { config } = this;
        for (const external of config.packageOptions.external) {
            if (packageName === external ||
                specifier === external ||
                packageName.startsWith(external + '/')) {
                return true;
            }
        }
        return false;
    }
}
exports.PackageSourceLocal = PackageSourceLocal;
