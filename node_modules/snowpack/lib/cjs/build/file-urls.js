"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlsForFile = exports.getMountEntryForFile = exports.getBuiltFileUrls = exports.getUrlsForFileMount = void 0;
const path_1 = __importDefault(require("path"));
const slash_1 = __importDefault(require("slash"));
const util_1 = require("../util");
const import_css_1 = require("./import-css");
/**
 * Map a file path to the hosted URL for a given "mount" entry.
 */
function getUrlsForFileMount({ fileLoc, mountKey, mountEntry, config, }) {
    const resolvedDirUrl = mountEntry.url === '/' ? '' : mountEntry.url;
    const mountedUrl = fileLoc.replace(mountKey, resolvedDirUrl).replace(/[/\\]+/g, '/');
    if (mountEntry.static) {
        return [mountedUrl];
    }
    return getBuiltFileUrls(mountedUrl, config);
}
exports.getUrlsForFileMount = getUrlsForFileMount;
/**
 * Map a file path to the hosted URL for a given "mount" entry.
 */
function getBuiltFileUrls(filepath, config) {
    const fileName = path_1.default.basename(filepath);
    const extensionMatch = util_1.getExtensionMatch(fileName, config._extensionMap);
    if (!extensionMatch) {
        // CSS Modules require a special .json mapping here
        if (import_css_1.needsCSSModules(filepath)) {
            return [filepath, filepath + '.json'];
        }
        // Otherwise, return only the requested file
        return [filepath];
    }
    const [inputExt, outputExts] = extensionMatch;
    return outputExts.map((outputExt) => {
        if (outputExts.length > 1) {
            return util_1.addExtension(filepath, outputExt);
        }
        else {
            return util_1.replaceExtension(filepath, inputExt, outputExt);
        }
    });
}
exports.getBuiltFileUrls = getBuiltFileUrls;
/**
 * Get the final, hosted URL path for a given file on disk.
 */
function getMountEntryForFile(fileLoc, config) {
    // PERF: Use `for...in` here instead of the slower `Object.entries()` method
    // that we use everywhere else, since this function can get called 100s of
    // times during a build.
    for (const mountKey in config.mount) {
        if (!config.mount.hasOwnProperty(mountKey)) {
            continue;
        }
        if (!fileLoc.startsWith(mountKey + path_1.default.sep)) {
            continue;
        }
        return [mountKey, config.mount[mountKey]];
    }
    return null;
}
exports.getMountEntryForFile = getMountEntryForFile;
/**
 * Get the final, hosted URL path for a given file on disk.
 */
function getUrlsForFile(fileLoc, config) {
    const mountEntryResult = getMountEntryForFile(fileLoc, config);
    if (!mountEntryResult) {
        if (!config.workspaceRoot) {
            return undefined;
        }
        const builtEntrypointUrls = getBuiltFileUrls(fileLoc, config);
        return builtEntrypointUrls.map((u) => path_1.default.posix.join(config.buildOptions.metaUrlPath, 'link', slash_1.default(path_1.default.relative(config.workspaceRoot, u))));
    }
    const [mountKey, mountEntry] = mountEntryResult;
    return getUrlsForFileMount({ fileLoc, mountKey, mountEntry, config });
}
exports.getUrlsForFile = getUrlsForFile;
