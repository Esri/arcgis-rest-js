"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollupPluginSkypack = void 0;
const cacache_1 = __importDefault(require("cacache"));
const util_1 = require("./util");
/**
 * rollup-plugin-remote-cdn
 *
 * Load import URLs from a remote CDN, sitting behind a local cache. The local
 * cache acts as a go-between for the resolve & load step: when we get back a
 * successful CDN resolution, we save the file to the local cache and then tell
 * rollup that it's safe to load from the cache in the `load()` hook.
 */
function rollupPluginSkypack({ sdk, logger }) {
    const CACHED_FILE_ID_PREFIX = 'remote-pkg-cache:';
    return {
        name: 'snowpack:rollup-plugin-remote-cdn',
        async resolveId(source, importer) {
            let cacheKey;
            if (source.startsWith(sdk.origin)) {
                cacheKey = source;
            }
            else if (source.startsWith('/-/')) {
                cacheKey = sdk.origin + source;
            }
            else if (source.startsWith('/pin/')) {
                cacheKey = sdk.origin + source;
            }
            else {
                return null;
            }
            // If the source path is a CDN path including a hash, it's assumed the
            // file will never change and it is safe to pull from our local cache
            // without a network request.
            logger.debug(`resolve ${cacheKey}`, { name: 'install:remote' });
            if (util_1.HAS_CDN_HASH_REGEX.test(cacheKey)) {
                const cachedResult = await cacache_1.default.get
                    .info(util_1.RESOURCE_CACHE, cacheKey)
                    .catch(( /* ignore */) => null);
                if (cachedResult) {
                    return CACHED_FILE_ID_PREFIX + cacheKey;
                }
            }
            // Otherwise, make the remote request and cache the file on success.
            const { statusCode } = await sdk.fetch(cacheKey);
            if (statusCode === 200) {
                return CACHED_FILE_ID_PREFIX + cacheKey;
            }
            // If lookup failed, skip this plugin and resolve the import locally instead.
            // TODO: Log that this has happened (if some sort of verbose mode is enabled).
            const packageName = cacheKey
                .substring(sdk.origin.length)
                .replace('/-/', '')
                .replace('/pin/', '')
                .split('@')[0];
            return this.resolve(packageName, importer, { skipSelf: true }).then((resolved) => {
                let finalResult = resolved;
                if (!finalResult) {
                    finalResult = { id: packageName };
                }
                return finalResult;
            });
        },
        async load(id) {
            if (!id.startsWith(CACHED_FILE_ID_PREFIX)) {
                return null;
            }
            const cacheKey = id.substring(CACHED_FILE_ID_PREFIX.length);
            logger.debug(`load ${cacheKey}`, { name: 'install:remote' });
            const { body } = await sdk.fetch(cacheKey);
            return body.toString();
        },
    };
}
exports.rollupPluginSkypack = rollupPluginSkypack;
//# sourceMappingURL=rollup-plugin-remote-cdn.js.map