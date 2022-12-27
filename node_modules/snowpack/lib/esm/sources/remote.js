import { existsSync } from 'fs';
import * as colors from 'kleur/colors';
import path from 'path';
import rimraf from 'rimraf';
import { clearCache as clearSkypackCache, rollupPluginSkypack } from 'skypack';
import util from 'util';
import { logger } from '../logger';
import { convertLockfileToSkypackImportMap, createRemotePackageSDK, isJavaScript, parsePackageImportSpecifier, readLockfile, } from '../util';
const fetchedPackages = new Set();
function logFetching(origin, packageName, packageSemver) {
    if (fetchedPackages.has(packageName)) {
        return;
    }
    fetchedPackages.add(packageName);
    logger.info(`import ${colors.bold(packageName + (packageSemver ? `@${packageSemver}` : ''))} ${colors.dim(`→ ${origin}/${packageName}`)}`);
    if (!packageSemver || packageSemver === 'latest') {
        logger.info(colors.yellow(`pin dependency to this version: \`snowpack add ${packageName}\``));
    }
}
/**
 * Remote Package Source: A generic interface through which
 * Snowpack interacts with the Skypack CDN. Used to load dependencies
 * from the CDN during both development and optimized building.
 */
export class PackageSourceRemote {
    constructor(config) {
        this.lockfile = null;
        this.config = config;
        this.remotePackageSDK = createRemotePackageSDK(config);
    }
    async prepare() {
        var _a;
        this.lockfile = await readLockfile(this.config.root);
        const { config, lockfile } = this;
        // Only install types if `packageOptions.types=true`. Otherwise, no need to prepare anything.
        if (config.packageOptions.source === 'remote' && !config.packageOptions.types) {
            return;
        }
        const lockEntryList = lockfile && Object.keys(lockfile.lock);
        if (!lockfile || !lockEntryList || lockEntryList.length === 0) {
            return;
        }
        logger.info('checking for new TypeScript types...', { name: 'packageOptions.types' });
        await rimraf.sync(path.join(this.getCacheFolder(), '.snowpack/types'));
        for (const lockEntry of lockEntryList) {
            const [packageName, semverRange] = lockEntry.split('#');
            const exactVersion = (_a = lockfile.lock[lockEntry]) === null || _a === void 0 ? void 0 : _a.substr(packageName.length + 1);
            await this.remotePackageSDK
                .installTypes(packageName, exactVersion || semverRange, path.join(this.getCacheFolder(), 'types'))
                .catch((err) => logger.debug('dts fetch error: ' + err.message));
        }
        // Skypack resolves imports on the fly, so no import map needed.
        logger.info(`types updated. ${colors.dim('→ ./.snowpack/types')}`, {
            name: 'packageOptions.types',
        });
    }
    async prepareSingleFile() {
        // Do nothing! Skypack loads packages on-demand.
    }
    async modifyBuildInstallOptions(installOptions) {
        const { config, lockfile } = this;
        installOptions.importMap = lockfile
            ? convertLockfileToSkypackImportMap(config.packageOptions.origin, lockfile)
            : undefined;
        installOptions.rollup = installOptions.rollup || {};
        installOptions.rollup.plugins = installOptions.rollup.plugins || [];
        installOptions.rollup.plugins.push(rollupPluginSkypack({
            sdk: this.remotePackageSDK,
            logger: {
                debug: (...args) => logger.debug(util.format(...args)),
                log: (...args) => logger.info(util.format(...args)),
                warn: (...args) => logger.warn(util.format(...args)),
                error: (...args) => logger.error(util.format(...args)),
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
            const [packageName, packagePath] = parsePackageImportSpecifier(spec);
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
                if (!existsSync(path.join(this.getCacheFolder(), '.snowpack/types', packageName))) {
                    this.remotePackageSDK
                        .installTypes(packageName, packageSemver, path.join(this.getCacheFolder(), '.snowpack/types'))
                        .catch(() => 'thats fine!');
                }
                body = lookupResponse.body;
            }
        }
        const ext = path.extname(spec);
        if (!ext || isJavaScript(spec)) {
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
        return path.posix.join(this.config.buildOptions.metaUrlPath, 'pkg', spec);
    }
    static clearCache() {
        return clearSkypackCache();
    }
    /** @deprecated */
    clearCache() {
        return clearSkypackCache();
    }
    getCacheFolder() {
        const { config } = this;
        return ((config.packageOptions.source === 'remote' && config.packageOptions.cache) ||
            path.join(config.root, '.snowpack'));
    }
}
