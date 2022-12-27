"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.SkypackSDK = exports.SKYPACK_ORIGIN = exports.rollupPluginSkypack = void 0;
const mkdirp_1 = __importDefault(require("mkdirp"));
const cacache_1 = __importDefault(require("cacache"));
const path_1 = __importDefault(require("path"));
const tar_1 = __importDefault(require("tar"));
const fs_1 = __importDefault(require("fs"));
const url_1 = __importDefault(require("url"));
const got_1 = __importDefault(require("got"));
const util_1 = require("./util");
var rollup_plugin_remote_cdn_1 = require("./rollup-plugin-remote-cdn");
Object.defineProperty(exports, "rollupPluginSkypack", { enumerable: true, get: function () { return rollup_plugin_remote_cdn_1.rollupPluginSkypack; } });
exports.SKYPACK_ORIGIN = `https://cdn.skypack.dev`;
function parseRawPackageImport(spec) {
    const impParts = spec.split('/');
    if (spec.startsWith('@')) {
        const [scope, name, ...rest] = impParts;
        return [`${scope}/${name}`, rest.join('/') || null];
    }
    const [name, ...rest] = impParts;
    return [name, rest.join('/') || null];
}
class SkypackSDK {
    constructor(options = {}) {
        this.origin = options.origin || `https://cdn.skypack.dev`;
    }
    async generateImportMap(webDependencies, inheritFromImportMap) {
        const newLockfile = inheritFromImportMap
            ? { imports: { ...inheritFromImportMap.imports } }
            : { imports: {} };
        await Promise.all(Object.entries(webDependencies).map(async ([packageName, packageSemver]) => {
            if (packageSemver === null) {
                delete newLockfile.imports[packageName];
                delete newLockfile.imports[packageName + '/'];
                return;
            }
            const lookupResponse = await this.lookupBySpecifier(packageName, packageSemver);
            if (lookupResponse.error) {
                throw lookupResponse.error;
            }
            if (lookupResponse.pinnedUrl) {
                let keepGoing = true;
                const deepPinnedUrlParts = lookupResponse.pinnedUrl.split('/');
                // TODO: Get ?meta support to get this info via JSON instead of header manipulation
                deepPinnedUrlParts.shift(); // remove ""
                deepPinnedUrlParts.shift(); // remove "pin"
                while (keepGoing) {
                    const investigate = deepPinnedUrlParts.pop();
                    if (util_1.HAS_CDN_HASH_REGEX.test(investigate)) {
                        keepGoing = false;
                        deepPinnedUrlParts.push(investigate);
                    }
                }
                newLockfile.imports[packageName] = this.origin + '/' + deepPinnedUrlParts.join('/');
                newLockfile.imports[packageName + '/'] =
                    this.origin + '/' + deepPinnedUrlParts.join('/') + '/';
            }
        }));
        const newLockfileSorted = Object.keys(newLockfile.imports).sort((a, b) => {
            // We want 'xxx/' to come after 'xxx', so we convert it to a space (the character with the highest sort order)
            // See: http://support.ecisolutions.com/doc-ddms/help/reportsmenu/ascii_sort_order_chart.htm
            return a.replace(/\/$/, ' ').localeCompare(b.replace(/\/$/, ' '));
        });
        return {
            imports: newLockfileSorted.reduce((prev, k) => {
                prev[k] = newLockfile.imports[k];
                return prev;
            }, {}),
        };
    }
    async fetch(resourceUrl, userAgent) {
        var _a;
        if (!resourceUrl.startsWith(this.origin)) {
            resourceUrl = this.origin + resourceUrl;
        }
        const cachedResult = await cacache_1.default.get(util_1.RESOURCE_CACHE, resourceUrl).catch(() => null);
        if (cachedResult) {
            const cachedResultMetadata = cachedResult.metadata;
            const freshUntil = new Date(cachedResult.metadata.freshUntil);
            if (freshUntil >= new Date()) {
                return {
                    isCached: true,
                    isStale: false,
                    body: cachedResult.data,
                    headers: cachedResultMetadata.headers,
                    statusCode: cachedResultMetadata.statusCode,
                };
            }
        }
        let freshResult;
        try {
            freshResult = await got_1.default(resourceUrl, {
                headers: { 'user-agent': userAgent || `skypack/v0.0.1` },
                throwHttpErrors: false,
                responseType: 'buffer',
            });
        }
        catch (err) {
            if (cachedResult) {
                const cachedResultMetadata = cachedResult.metadata;
                return {
                    isCached: true,
                    isStale: true,
                    body: cachedResult.data,
                    headers: cachedResultMetadata.headers,
                    statusCode: cachedResultMetadata.statusCode,
                };
            }
            throw err;
        }
        const cacheUntilMatch = (_a = freshResult.headers['cache-control']) === null || _a === void 0 ? void 0 : _a.match(/max-age=(\d+)/);
        if (cacheUntilMatch) {
            var freshUntil = new Date();
            freshUntil.setSeconds(freshUntil.getSeconds() + parseInt(cacheUntilMatch[1]));
            // no need to await, since we `.catch()` to swallow any errors.
            cacache_1.default
                .put(util_1.RESOURCE_CACHE, resourceUrl, freshResult.body, {
                metadata: {
                    headers: freshResult.headers,
                    statusCode: freshResult.statusCode,
                    freshUntil: freshUntil.toUTCString(),
                },
            })
                .catch(() => null);
        }
        return {
            body: freshResult.body,
            headers: freshResult.headers,
            statusCode: freshResult.statusCode,
            isCached: false,
            isStale: false,
        };
    }
    async buildNewPackage(spec, semverString, userAgent) {
        const [packageName, packagePath] = parseRawPackageImport(spec);
        const lookupUrl = `/new/${packageName}` +
            (semverString ? `@${semverString}` : ``) +
            (packagePath ? `/${packagePath}` : ``);
        try {
            const { statusCode } = await this.fetch(lookupUrl, userAgent);
            return {
                error: null,
                success: statusCode !== 500,
            };
        }
        catch (err) {
            return { error: err, success: false };
        }
    }
    async lookupBySpecifier(spec, semverString, qs, userAgent) {
        const [packageName, packagePath] = parseRawPackageImport(spec);
        const lookupUrl = `/${packageName}` +
            (semverString ? `@${semverString}` : ``) +
            (packagePath ? `/${packagePath}` : ``) +
            (qs ? `?${qs}` : ``);
        try {
            const { body, statusCode, headers, isCached, isStale } = await this.fetch(lookupUrl, userAgent);
            if (statusCode !== 200) {
                return { error: new Error(body.toString()) };
            }
            return {
                error: null,
                body,
                isCached,
                isStale,
                importStatus: headers['x-import-status'],
                importUrl: headers['x-import-url'],
                pinnedUrl: headers['x-pinned-url'],
                typesUrl: headers['x-typescript-types'],
            };
        }
        catch (err) {
            return { error: err };
        }
    }
    async installTypes(spec, semverString, dir) {
        dir = dir || path_1.default.join(process.cwd(), '.types');
        const lookupResult = await this.lookupBySpecifier(spec, semverString, 'dts');
        if (lookupResult.error) {
            throw lookupResult.error;
        }
        if (!lookupResult.typesUrl) {
            throw new Error(`Skypack CDN: No types found "${spec}"`);
        }
        const typesTarballUrl = lookupResult.typesUrl.replace(/(mode=types.*?)\/.*/, '$1/all.tgz');
        await mkdirp_1.default(dir);
        const tempDir = await cacache_1.default.tmp.mkdir(util_1.RESOURCE_CACHE);
        let tarballContents;
        const cachedTarball = await cacache_1.default
            .get(util_1.RESOURCE_CACHE, typesTarballUrl)
            .catch(( /* ignore */) => null);
        if (cachedTarball) {
            tarballContents = cachedTarball.data;
        }
        else {
            const tarballResponse = await this.fetch(typesTarballUrl);
            if (tarballResponse.statusCode !== 200) {
                throw new Error(tarballResponse.body.toString());
            }
            tarballContents = tarballResponse.body;
            await cacache_1.default.put(util_1.RESOURCE_CACHE, typesTarballUrl, tarballContents);
        }
        const typesUrlParts = url_1.default.parse(typesTarballUrl).pathname.split('/');
        const typesPackageName = url_1.default.parse(typesTarballUrl).pathname.startsWith('/-/@')
            ? typesUrlParts[2] + '/' + typesUrlParts[3].split('@')[0]
            : typesUrlParts[2].split('@')[0];
        const typesPackageTarLoc = path_1.default.join(tempDir, `${typesPackageName}.tgz`);
        if (typesPackageName.includes('/')) {
            await mkdirp_1.default(path_1.default.dirname(typesPackageTarLoc));
        }
        fs_1.default.writeFileSync(typesPackageTarLoc, tarballContents);
        const typesPackageLoc = path_1.default.join(dir, typesPackageName);
        await mkdirp_1.default(typesPackageLoc);
        await tar_1.default.x({
            file: typesPackageTarLoc,
            cwd: typesPackageLoc,
        });
    }
}
exports.SkypackSDK = SkypackSDK;
async function clearCache() {
    return cacache_1.default.rm.all(util_1.RESOURCE_CACHE);
}
exports.clearCache = clearCache;
//# sourceMappingURL=index.js.map