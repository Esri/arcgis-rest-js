"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageSource = exports.clearCache = exports.GLOBAL_CACHE_DIR = void 0;
const local_1 = require("./local");
const remote_1 = require("./remote");
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const cachedir_1 = __importDefault(require("cachedir"));
exports.GLOBAL_CACHE_DIR = cachedir_1.default('snowpack');
async function clearCache() {
    return Promise.all([
        remote_1.PackageSourceRemote.clearCache(),
        // NOTE(v4.0): This function is called before config has been created.
        // But, when `packageOptions.source="remote-next"` the ".snowpack" cache
        // directory lives in the config.root directory. We fake it here,
        // and can revisit this API (probably add config as an arg) in v4.0.
        rimraf_1.default.sync(path_1.default.join(process.cwd(), '.snowpack')),
        rimraf_1.default.sync(path_1.default.join(process.cwd(), 'node_modules', '.cache', 'snowpack')),
    ]);
}
exports.clearCache = clearCache;
const remoteSourceCache = new WeakMap();
const localSourceCache = new WeakMap();
function getPackageSource(config) {
    if (config.packageOptions.source === 'remote') {
        if (remoteSourceCache.has(config)) {
            return remoteSourceCache.get(config);
        }
        const source = new remote_1.PackageSourceRemote(config);
        remoteSourceCache.set(config, source);
        return source;
    }
    if (localSourceCache.has(config)) {
        return localSourceCache.get(config);
    }
    const source = new local_1.PackageSourceLocal(config);
    localSourceCache.set(config, source);
    return source;
}
exports.getPackageSource = getPackageSource;
