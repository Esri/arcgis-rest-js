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
exports.PackageSourceRemote = void 0;
const fs_1 = require("fs");
const colors = __importStar(require("kleur/colors"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const skypack_1 = require("skypack");
const util_1 = __importDefault(require("util"));
const logger_1 = require("../logger");
const util_2 = require("../util");
const fetchedPackages = new Set();
function logFetching(origin, packageName, packageSemver) {
    if (fetchedPackages.has(packageName)) {
        return;
    }
    fetchedPackages.add(packageName);
    logger_1.logger.info(`import ${colors.bold(packageName + (packageSemver ? `@${packageSemver}` : ''))} ${colors.dim(`→ ${origin}/${packageName}`)}`);
    if (!packageSemver || packageSemver === 'latest') {
        logger_1.logger.info(colors.yellow(`pin dependency to this version: \`snowpack add ${packageName}\``));
    }
}
/**
 * Remote Package Source: A generic interface through which
 * Snowpack interacts with the Skypack CDN. Used to load dependencies
 * from the CDN during both development and optimized building.
 */
class PackageSourceRemote {
    constructor(config) {
        this.lockfile = null;
        this.config = config;
        this.remotePackageSDK = util_2.createRemotePackageSDK(config);
    }
    async prepare() {
        var _a;
        this.lockfile = await util_2.readLockfile(this.config.root);
        const { config, lockfile } = this;
        // Only install types if `packageOptions.types=true`. Otherwise, no need to prepare anything.
        if (config.packageOptions.source === 'remote' && !config.packageOptions.types) {
            return;
        }
        const lockEntryList = lockfile && Object.keys(lockfile.lock);
        if (!lockfile || !lockEntryList || lockEntryList.length === 0) {
            return;
        }
        logger_1.logger.info('checking for new TypeScript types...', { name: 'packageOptions.types' });
        await rimraf_1.default.sync(path_1.default.join(this.getCacheFolder(), '.snowpack/types'));
        for (const lockEntry of lockEntryList) {
            const [packageName, semverRange] = lockEntry.split('#');
            const exactVersion = (_a = lockfile.lock[lockEntry]) === null || _a === void 0 ? void 0 : _a.substr(packageName.length + 1);
            await this.remotePackageSDK
                .installTypes(packageName, exactVersion || semverRange, path_1.default.join(this.getCacheFolder(), 'types'))
                .catch((err) => logger_1.logger.debug('dts fetch error: ' + err.message));
        }
        // Skypack resolves imports on the fly, so no import map needed.
        logger_1.logger.info(`types updated. ${colors.dim('→ ./.snowpack/types')}`, {
            name: 'packageOptions.types',
        });
    }
    async prepareSingleFile() {
        // Do nothing! Skypack loads packages on-demand.
    }
    async modifyBuildInstallOptions(installOptions) {
        const { config, lockfile } = this;
        installOptions.importMap = lockfile
            ? util_2.convertLockfileToSkypackImportMap(config.packageOptions.origin, lockfile)
            : undefined;
        installOptions.rollup = installOptions.rollup || {};
        installOptions.rollup.plugins = installOptions.rollup.plugins || [];
        installOptions.rollup.plugins.push(skypack_1.rollupPluginSkypack({
            sdk: this.remotePackageSDK,
            logger: {
                debug: (...args) => logger_1.logger.debug(util_1.default.format(...args)),
                log: (...args) => logger_1.logger.info(util_1.default.format(...args)),
                warn: (...args) => logger_1.logger.warn(util_1.default.format(...args)),
                error: (...args) => logger_1.logger.error(util_1.default.format(...args)),
            },
        }));
        // config.installOptions.lockfile = lockfile || undefined;
        return installOptions;
    }
    async load(spec) {
        const { config, lockfile } = this;
        let body;
        if (spec.startsWith('-/') ||
            spec.startsWith('pin/') ||
            spec.startsWith('new/') ||
            spec.startsWith('error/')) {
            body = (await this.remotePackageSDK.fetch(`/${spec}`)).body;
        }
        else {
            const [packageName, packagePath] = util_2.parsePackageImportSpecifier(spec);
            if (lockfile && lockfile.dependencies[packageName]) {
                const lockEntry = packageName + '#' + lockfile.dependencies[packageName];
                if (packagePath) {
                    body = (await this.remotePackageSDK.fetch('/' + lockfile.lock[lockEntry] + '/' + packagePath)).body;
                }
                else {
                    body = (await this.remotePackageSDK.fetch('/' + lockfile.lock[lockEntry])).body;
                }
            }
            else {
                const packageSemver = 'latest';
                logFetching(config.packageOptions.origin, packageName, packageSemver);
                let lookupResponse = await this.remotePackageSDK.lookupBySpecifier(spec, packageSemver);
                if (!lookupResponse.error && lookupResponse.importStatus === 'NEW') {
                    const buildResponse = await this.remotePackageSDK.buildNewPackage(spec, packageSemver);
                    if (!buildResponse.success) {
                        throw new Error('Package could not be built!');
                    }
                    lookupResponse = await this.remotePackageSDK.lookupBySpecifier(spec, packageSemver);
                }
                if (lookupResponse.error) {
                    throw lookupResponse.error;
                }
                // Trigger a type fetch asynchronously. We want to resolve the JS as fast as possible, and
                // the result of this is totally disconnected from the loading flow.
                if (!fs_1.existsSync(path_1.default.join(this.getCacheFolder(), '.snowpack/types', packageName))) {
                    this.remotePackageSDK
                        .installTypes(packageName, packageSemver, path_1.default.join(this.getCacheFolder(), '.snowpack/types'))
                        .catch(() => 'thats fine!');
                }
                body = lookupResponse.body;
            }
        }
        const ext = path_1.default.extname(spec);
        if (!ext || util_2.isJavaScript(spec)) {
            return {
                contents: body
                    .toString()
                    .replace(/(from|import) \'\//g, `$1 '${config.buildOptions.metaUrlPath}/pkg/`)
                    .replace(/(from|import) \"\//g, `$1 "${config.buildOptions.metaUrlPath}/pkg/`),
                imports: [],
            };
        }
        return { contents: body, imports: [] };
    }
    // TODO: Remove need for lookup URLs
    async resolvePackageImport(spec) {
        return path_1.default.posix.join(this.config.buildOptions.metaUrlPath, 'pkg', spec);
    }
    static clearCache() {
        return skypack_1.clearCache();
    }
    /** @deprecated */
    clearCache() {
        return skypack_1.clearCache();
    }
    getCacheFolder() {
        const { config } = this;
        return ((config.packageOptions.source === 'remote' && config.packageOptions.cache) ||
            path_1.default.join(config.root, '.snowpack'));
    }
}
exports.PackageSourceRemote = PackageSourceRemote;
