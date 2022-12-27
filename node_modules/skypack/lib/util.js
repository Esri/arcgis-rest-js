"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTrailingSlash = exports.addLeadingSlash = exports.removeTrailingSlash = exports.removeLeadingSlash = exports.jsSourceMappingURL = exports.cssSourceMappingURL = exports.sanitizePackageName = exports.replaceExt = exports.getExt = exports.isPackageAliasEntry = exports.findMatchingAliasEntry = exports.updateLockfileHash = exports.checkLockfileHash = exports.MISSING_PLUGIN_SUGGESTIONS = exports.resolveDependencyManifest = exports.parsePackageImportSpecifier = exports.isTruthy = exports.writeLockfile = exports.readLockfile = exports.getEncodingType = exports.URL_HAS_PROTOCOL_REGEX = exports.SVELTE_VUE_REGEX = exports.CSS_REGEX = exports.HTML_JS_REGEX = exports.BUILD_CACHE = exports.HAS_CDN_HASH_REGEX = exports.RESOURCE_CACHE = exports.GLOBAL_CACHE_DIR = void 0;
const cachedir_1 = __importDefault(require("cachedir"));
const etag_1 = __importDefault(require("etag"));
const find_up_1 = __importDefault(require("find-up"));
const fs_1 = __importDefault(require("fs"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
exports.GLOBAL_CACHE_DIR = cachedir_1.default('skypack');
exports.RESOURCE_CACHE = path_1.default.join(exports.GLOBAL_CACHE_DIR, 'pkg-cache-3.0');
exports.HAS_CDN_HASH_REGEX = /\-[a-zA-Z0-9]{16,}/;
// A note on cache naming/versioning: We currently version our global caches
// with the version of the last breaking change. This allows us to re-use the
// same cache across versions until something in the data structure changes.
// At that point, bump the version in the cache name to create a new unique
// cache name.
exports.BUILD_CACHE = path_1.default.join(exports.GLOBAL_CACHE_DIR, 'build-cache-2.7');
const LOCKFILE_HASH_FILE = '.hash';
// NOTE(fks): Must match empty script elements to work properly.
exports.HTML_JS_REGEX = /(<script.*?type="?module"?.*?>)(.*?)<\/script>/gms;
exports.CSS_REGEX = /@import\s*['"](.*)['"];/gs;
exports.SVELTE_VUE_REGEX = /(<script[^>]*>)(.*?)<\/script>/gms;
exports.URL_HAS_PROTOCOL_REGEX = /^(\w+:)?\/\//;
const UTF8_FORMATS = ['.css', '.html', '.js', '.map', '.mjs', '.json', '.svg', '.txt', '.xml'];
function getEncodingType(ext) {
    return UTF8_FORMATS.includes(ext) ? 'utf-8' : undefined;
}
exports.getEncodingType = getEncodingType;
async function readLockfile(cwd) {
    try {
        var lockfileContents = fs_1.default.readFileSync(path_1.default.join(cwd, 'snowpack.lock.json'), {
            encoding: 'utf-8',
        });
    }
    catch (err) {
        // no lockfile found, ignore and continue
        return null;
    }
    // If this fails, we actually do want to alert the user by throwing
    return JSON.parse(lockfileContents);
}
exports.readLockfile = readLockfile;
async function writeLockfile(loc, importMap) {
    const sortedImportMap = { imports: {} };
    for (const key of Object.keys(importMap.imports).sort()) {
        sortedImportMap.imports[key] = importMap.imports[key];
    }
    fs_1.default.writeFileSync(loc, JSON.stringify(sortedImportMap, undefined, 2), { encoding: 'utf-8' });
}
exports.writeLockfile = writeLockfile;
function isTruthy(item) {
    return Boolean(item);
}
exports.isTruthy = isTruthy;
/** Get the package name + an entrypoint within that package (if given). */
function parsePackageImportSpecifier(imp) {
    const impParts = imp.split('/');
    if (imp.startsWith('@')) {
        const [scope, name, ...rest] = impParts;
        return [`${scope}/${name}`, rest.join('/') || null];
    }
    const [name, ...rest] = impParts;
    return [name, rest.join('/') || null];
}
exports.parsePackageImportSpecifier = parsePackageImportSpecifier;
/**
 * Given a package name, look for that package's package.json manifest.
 * Return both the manifest location (if believed to exist) and the
 * manifest itself (if found).
 *
 * NOTE: You used to be able to require() a package.json file directly,
 * but now with export map support in Node v13 that's no longer possible.
 */
function resolveDependencyManifest(dep, cwd) {
    // Attempt #1: Resolve the dependency manifest normally. This works for most
    // packages, but fails when the package defines an export map that doesn't
    // include a package.json. If we detect that to be the reason for failure,
    // move on to our custom implementation.
    try {
        const depManifest = require.resolve(`${dep}/package.json`, { paths: [cwd] });
        return [depManifest, require(depManifest)];
    }
    catch (err) {
        // if its an export map issue, move on to our manual resolver.
        if (err.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
            return [null, null];
        }
    }
    // Attempt #2: Resolve the dependency manifest manually. This involves resolving
    // the dep itself to find the entrypoint file, and then haphazardly replacing the
    // file path within the package with a "./package.json" instead. It's not as
    // thorough as Attempt #1, but it should work well until export maps become more
    // established & move out of experimental mode.
    let result = [null, null];
    try {
        const fullPath = require.resolve(dep, { paths: [cwd] });
        // Strip everything after the package name to get the package root path
        // NOTE: This find-replace is very gross, replace with something like upath.
        const searchPath = `${path_1.default.sep}node_modules${path_1.default.sep}${dep.replace('/', path_1.default.sep)}`;
        const indexOfSearch = fullPath.lastIndexOf(searchPath);
        if (indexOfSearch >= 0) {
            const manifestPath = fullPath.substring(0, indexOfSearch + searchPath.length + 1) + 'package.json';
            result[0] = manifestPath;
            const manifestStr = fs_1.default.readFileSync(manifestPath, { encoding: 'utf-8' });
            result[1] = JSON.parse(manifestStr);
        }
    }
    catch (err) {
        // ignore
    }
    finally {
        return result;
    }
}
exports.resolveDependencyManifest = resolveDependencyManifest;
/**
 * If Rollup erred parsing a particular file, show suggestions based on its
 * file extension (note: lowercase is fine).
 */
exports.MISSING_PLUGIN_SUGGESTIONS = {
    '.svelte': 'Try installing rollup-plugin-svelte and adding it to Snowpack (https://www.snowpack.dev/tutorials/svelte)',
    '.vue': 'Try installing rollup-plugin-vue and adding it to Snowpack (https://www.snowpack.dev/guides/vue)',
};
async function checkLockfileHash(dir) {
    const lockfileLoc = await find_up_1.default(['package-lock.json', 'yarn.lock']);
    if (!lockfileLoc) {
        return true;
    }
    const hashLoc = path_1.default.join(dir, LOCKFILE_HASH_FILE);
    const newLockHash = etag_1.default(await fs_1.default.promises.readFile(lockfileLoc, 'utf-8'));
    const oldLockHash = await fs_1.default.promises.readFile(hashLoc, 'utf-8').catch(() => '');
    return newLockHash === oldLockHash;
}
exports.checkLockfileHash = checkLockfileHash;
async function updateLockfileHash(dir) {
    const lockfileLoc = await find_up_1.default(['package-lock.json', 'yarn.lock']);
    if (!lockfileLoc) {
        return;
    }
    const hashLoc = path_1.default.join(dir, LOCKFILE_HASH_FILE);
    const newLockHash = etag_1.default(await fs_1.default.promises.readFile(lockfileLoc));
    await mkdirp_1.default(path_1.default.dirname(hashLoc));
    await fs_1.default.promises.writeFile(hashLoc, newLockHash);
}
exports.updateLockfileHash = updateLockfileHash;
/**
 * For the given import specifier, return an alias entry if one is matched.
 */
function findMatchingAliasEntry(alias, spec) {
    // Only match bare module specifiers. relative and absolute imports should not match
    if (spec === '.' ||
        spec === '..' ||
        spec.startsWith('./') ||
        spec.startsWith('../') ||
        spec.startsWith('/') ||
        spec.startsWith('http://') ||
        spec.startsWith('https://')) {
        return undefined;
    }
    for (const [from, to] of Object.entries(alias)) {
        let foundType = isPackageAliasEntry(to) ? 'package' : 'path';
        const isExactMatch = spec === removeTrailingSlash(from);
        const isDeepMatch = spec.startsWith(addTrailingSlash(from));
        if (isExactMatch || isDeepMatch) {
            return {
                from,
                to,
                type: foundType,
            };
        }
    }
}
exports.findMatchingAliasEntry = findMatchingAliasEntry;
/**
 * For the given import specifier, return an alias entry if one is matched.
 */
function isPackageAliasEntry(val) {
    return !path_1.default.isAbsolute(val);
}
exports.isPackageAliasEntry = isPackageAliasEntry;
/** Get full extensions of files */
function getExt(fileName) {
    return {
        /** base extension (e.g. `.js`) */
        baseExt: path_1.default.extname(fileName).toLocaleLowerCase(),
        /** full extension, if applicable (e.g. `.proxy.js`) */
        expandedExt: path_1.default.basename(fileName).replace(/[^.]+/, '').toLocaleLowerCase(),
    };
}
exports.getExt = getExt;
/** Replace file extensions */
function replaceExt(fileName, oldExt, newExt) {
    const extToReplace = new RegExp(`\\${oldExt}$`, 'i');
    return fileName.replace(extToReplace, newExt);
}
exports.replaceExt = replaceExt;
/**
 * Sanitizes npm packages that end in .js (e.g `tippy.js` -> `tippyjs`).
 * This is necessary because Snowpack can’t create both a file and directory
 * that end in .js.
 */
function sanitizePackageName(filepath) {
    const dirs = filepath.split('/');
    const file = dirs.pop();
    return [...dirs.map((path) => path.replace(/\.js$/i, 'js')), file].join('/');
}
exports.sanitizePackageName = sanitizePackageName;
// Source Map spec v3: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.lmz475t4mvbx
/** CSS sourceMappingURL */
function cssSourceMappingURL(code, sourceMappingURL) {
    return code + `/*# sourceMappingURL=${sourceMappingURL} */`;
}
exports.cssSourceMappingURL = cssSourceMappingURL;
/** JS sourceMappingURL */
function jsSourceMappingURL(code, sourceMappingURL) {
    return code.replace(/\n*$/, '') + `\n//# sourceMappingURL=${sourceMappingURL}\n`; // strip ending lines & append source map (with linebreaks for safety)
}
exports.jsSourceMappingURL = jsSourceMappingURL;
function removeLeadingSlash(path) {
    return path.replace(/^[/\\]+/, '');
}
exports.removeLeadingSlash = removeLeadingSlash;
function removeTrailingSlash(path) {
    return path.replace(/[/\\]+$/, '');
}
exports.removeTrailingSlash = removeTrailingSlash;
function addLeadingSlash(path) {
    return path.replace(/^\/?/, '/');
}
exports.addLeadingSlash = addLeadingSlash;
function addTrailingSlash(path) {
    return path.replace(/\/?$/, '/');
}
exports.addTrailingSlash = addTrailingSlash;
//# sourceMappingURL=util.js.map