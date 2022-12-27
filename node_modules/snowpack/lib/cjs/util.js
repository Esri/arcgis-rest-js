"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HMR_OVERLAY_CODE = exports.HMR_CLIENT_CODE = exports.spliceString = exports.removeTrailingSlash = exports.removeLeadingSlash = exports.addTrailingSlash = exports.addLeadingSlash = exports.removeExtension = exports.addExtension = exports.replaceExtension = exports.hasExtension = exports.getExtension = exports.isJavaScript = exports.appendHtmlToHead = exports.relativeURL = exports.jsSourceMappingURL = exports.cssSourceMappingURL = exports.sanitizePackageName = exports.isImportOfPackage = exports.isRemoteUrl = exports.isPathImport = exports.getExtensionMatch = exports.findMatchingAliasEntry = exports.updateLockfileHash = exports.checkLockfileHash = exports.openInBrowser = exports.MISSING_PLUGIN_SUGGESTIONS = exports.resolveDependencyManifest = exports.parsePackageImportSpecifier = exports.isFsEventsEnabled = exports.isTruthy = exports.writeLockfile = exports.convertSkypackImportMapToLockfile = exports.convertLockfileToSkypackImportMap = exports.createInstallTarget = exports.readLockfile = exports.readFile = exports.deleteFromBuildSafe = exports.getCacheKey = exports.ASTRO_REGEX = exports.SVELTE_VUE_REGEX = exports.CSS_REGEX = exports.HTML_STYLE_REGEX = exports.HTML_JS_REGEX = exports.BUILD_CACHE = exports.createRemotePackageSDK = exports.REQUIRE_OR_IMPORT = exports.NATIVE_REQUIRE = exports.LOCKFILE_NAME = exports.IS_DOTFILE_REGEX = void 0;
exports.INIT_TEMPLATE_FILE = void 0;
const etag_1 = __importDefault(require("etag"));
const execa_1 = __importDefault(require("execa"));
const find_up_1 = __importDefault(require("find-up"));
const fs_1 = __importDefault(require("fs"));
const isbinaryfile_1 = require("isbinaryfile");
const mkdirp_1 = __importDefault(require("mkdirp"));
const open_1 = __importDefault(require("open"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const url_1 = __importDefault(require("url"));
const default_browser_id_1 = __importDefault(require("default-browser-id"));
const skypack_1 = require("skypack");
const config_1 = require("./config");
const util_1 = require("./sources/util");
// (!) Beware circular dependencies! No relative imports!
// Because this file is imported from so many different parts of Snowpack,
// importing other relative files inside of it is likely to introduce broken
// circular dependencies (sometimes only visible in the final bundled build.)
exports.IS_DOTFILE_REGEX = /\/\.[^\/]+$/; // note: always assume forward-slashes, even on Windows
exports.LOCKFILE_NAME = 'snowpack.deps.json';
// We need to use eval here to prevent Rollup from detecting this use of `require()`
exports.NATIVE_REQUIRE = eval('require');
// We need to use an external file here to prevent Typescript/Rollup from modifying `require` and `import`
// NOTE: revisit this when `node@10` reaches EOL. Can we move everything to ESM and just use `import`?
exports.REQUIRE_OR_IMPORT = require('../../assets/require-or-import.js');
function createRemotePackageSDK(config) {
    // This should only be called when config.packageOptions.source is 'remote'.
    if (config.packageOptions.source !== 'remote') {
        throw new Error('expected "remote" packageOptions.source');
    }
    // For consistency with previous behavior, we default to REMOTE_PACKAGE_ORIGIN
    // if no origin is provided.  We could simply leave it undefined and allow
    // SkypackSDK to use its own default.
    return new skypack_1.SkypackSDK({
        origin: config.packageOptions.origin || config_1.REMOTE_PACKAGE_ORIGIN,
    });
}
exports.createRemotePackageSDK = createRemotePackageSDK;
// A note on cache naming/versioning: We currently version our global caches
// with the version of the last breaking change. This allows us to re-use the
// same cache across versions until something in the data structure changes.
// At that point, bump the version in the cache name to create a new unique
// cache name.
exports.BUILD_CACHE = path_1.default.join(util_1.GLOBAL_CACHE_DIR, 'build-cache-2.7');
const LOCKFILE_HASH_FILE = '.hash';
// NOTE(fks): Must match empty script elements to work properly.
exports.HTML_JS_REGEX = /(<script[^>]*?type="module".*?>)(.*?)<\/script>/gims;
exports.HTML_STYLE_REGEX = /(<style.*?>)(.*?)<\/style>/gims;
exports.CSS_REGEX = /@import\s*['"](.*?)['"];/gs;
exports.SVELTE_VUE_REGEX = /(<script[^>]*>)(.*?)<\/script>/gims;
exports.ASTRO_REGEX = /---(.*?)---/gims;
function getCacheKey(fileLoc, { isSSR, mode }) {
    return `${fileLoc}?mode=${mode}&isSSR=${isSSR ? '1' : '0'}`;
}
exports.getCacheKey = getCacheKey;
/**
 * Like rimraf, but will fail if "dir" is outside of your configured build output directory.
 */
function deleteFromBuildSafe(dir, config) {
    const { out } = config.buildOptions;
    if (!path_1.default.isAbsolute(dir)) {
        throw new Error(`rimrafSafe(): dir ${dir} must be a absolute path`);
    }
    if (!path_1.default.isAbsolute(out)) {
        throw new Error(`rimrafSafe(): buildOptions.out ${out} must be a absolute path`);
    }
    if (!dir.startsWith(out)) {
        throw new Error(`rimrafSafe(): ${dir} outside of buildOptions.out ${out}`);
    }
    return rimraf_1.default.sync(dir);
}
exports.deleteFromBuildSafe = deleteFromBuildSafe;
/** Read file from disk; return a string if it’s a code file */
async function readFile(filepath) {
    let data = await fs_1.default.promises.readFile(filepath);
    if (!data) {
        console.error(`Unexpected Node.js error: readFile(${filepath}) returned undefined.\n\n` +
            `Somehow in Github CI / Jest its possible for fs.promises.readFile to return undefined.\n` +
            `This should be impossible, and has not yet been reproduced in the real world, but we do see it in our own CI.\n` +
            `If you are seeing this error, please report!`);
        data = fs_1.default.readFileSync(filepath);
    }
    const isBinary = await isbinaryfile_1.isBinaryFile(data);
    return isBinary ? data : data.toString('utf8');
}
exports.readFile = readFile;
async function readLockfile(cwd) {
    try {
        var lockfileContents = fs_1.default.readFileSync(path_1.default.join(cwd, exports.LOCKFILE_NAME), {
            encoding: 'utf8',
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
function createInstallTarget(specifier, all = true) {
    return {
        specifier,
        all,
        default: false,
        namespace: false,
        named: [],
    };
}
exports.createInstallTarget = createInstallTarget;
function sortObject(originalObject) {
    const newObject = {};
    for (const key of Object.keys(originalObject).sort()) {
        newObject[key] = originalObject[key];
    }
    return newObject;
}
function convertLockfileToSkypackImportMap(origin, lockfile) {
    const result = { imports: {} };
    for (const [key, val] of Object.entries(lockfile.lock)) {
        result.imports[key.replace(/\#.*/, '')] = origin + '/' + val;
        result.imports[key.replace(/\#.*/, '') + '/'] = origin + '/' + val + '/';
    }
    return result;
}
exports.convertLockfileToSkypackImportMap = convertLockfileToSkypackImportMap;
function convertSkypackImportMapToLockfile(dependencies, importMap) {
    const result = { dependencies, lock: {} };
    for (const [key, val] of Object.entries(dependencies)) {
        if (importMap.imports[key]) {
            const valPath = url_1.default.parse(importMap.imports[key]).pathname;
            result.lock[key + '#' + val] = valPath === null || valPath === void 0 ? void 0 : valPath.substr(1);
        }
    }
    return result;
}
exports.convertSkypackImportMapToLockfile = convertSkypackImportMapToLockfile;
async function writeLockfile(loc, importMap) {
    importMap.dependencies = sortObject(importMap.dependencies);
    importMap.lock = sortObject(importMap.lock);
    fs_1.default.writeFileSync(loc, JSON.stringify(importMap, undefined, 2), { encoding: 'utf8' });
}
exports.writeLockfile = writeLockfile;
function isTruthy(item) {
    return Boolean(item);
}
exports.isTruthy = isTruthy;
/**
 * Returns true if fsevents exists. When Snowpack is bundled, automatic fsevents
 * detection fails for many libraries. This function helps add back support.
 */
function isFsEventsEnabled() {
    try {
        exports.NATIVE_REQUIRE('fsevents');
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isFsEventsEnabled = isFsEventsEnabled;
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
        const depManifest = fs_1.default.realpathSync.native(require.resolve(`${dep}/package.json`, { paths: [cwd] }));
        return [depManifest, exports.NATIVE_REQUIRE(depManifest)];
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
        const fullPath = fs_1.default.realpathSync.native(require.resolve(dep, { paths: [cwd] }));
        // Strip everything after the package name to get the package root path
        // NOTE: This find-replace is very gross, replace with something like upath.
        const searchPath = `${path_1.default.sep}node_modules${path_1.default.sep}${dep.replace('/', path_1.default.sep)}`;
        const indexOfSearch = fullPath.lastIndexOf(searchPath);
        if (indexOfSearch >= 0) {
            const manifestPath = fullPath.substring(0, indexOfSearch + searchPath.length + 1) + 'package.json';
            result[0] = manifestPath;
            const manifestStr = fs_1.default.readFileSync(manifestPath, { encoding: 'utf8' });
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
const appNames = {
    win32: {
        brave: 'brave',
    },
    darwin: {
        brave: 'Brave Browser',
    },
    linux: {
        brave: 'brave',
    },
};
async function openInExistingChromeBrowser(url) {
    // see if Chrome process is open; fail if not
    await execa_1.default.command('ps cax | grep "Google Chrome"', {
        shell: true,
    });
    // use open Chrome tab if exists; create new Chrome tab if not
    const openChrome = execa_1.default('osascript ../../assets/openChrome.appleScript "' + encodeURI(url) + '"', {
        cwd: __dirname,
        stdio: 'ignore',
        shell: true,
    });
    // if Chrome doesn’t respond within 3s, fall back to opening new tab in default browser
    let isChromeStalled = setTimeout(() => {
        openChrome.cancel();
    }, 3000);
    try {
        await openChrome;
    }
    catch (err) {
        if (err.isCanceled) {
            console.warn(`Chrome not responding to Snowpack after 3s. Opening in new tab.`);
        }
        else {
            console.error(err.toString() || err);
        }
        throw err;
    }
    finally {
        clearTimeout(isChromeStalled);
    }
}
async function openInBrowser(protocol, hostname, port, browser, openUrl) {
    const url = new URL(openUrl || '', `${protocol}//${hostname}:${port}`).toString();
    if (/chrome/i.test(browser)) {
        browser = open_1.default.apps.chrome;
    }
    if (/brave/i.test(browser)) {
        browser = appNames[process.platform]['brave'];
    }
    const isMacChrome = process.platform === 'darwin' &&
        (/chrome/i.test(browser) ||
            (/default/i.test(browser) && /chrome/i.test(await default_browser_id_1.default())));
    if (!isMacChrome) {
        await (browser === 'default' ? open_1.default(url) : open_1.default(url, { app: { name: browser } }));
        return;
    }
    try {
        // If we're on macOS, and we haven't requested a specific browser,
        // we can try opening Chrome with AppleScript. This lets us reuse an
        // existing tab when possible instead of creating a new one.
        await openInExistingChromeBrowser(url);
    }
    catch (err) {
        // if no open Chrome process, just go ahead and open default browser.
        await open_1.default(url);
    }
}
exports.openInBrowser = openInBrowser;
async function checkLockfileHash(dir) {
    const lockfileLoc = await find_up_1.default(['package-lock.json', 'yarn.lock']);
    if (!lockfileLoc) {
        return true;
    }
    const hashLoc = path_1.default.join(dir, LOCKFILE_HASH_FILE);
    const newLockHash = etag_1.default(await fs_1.default.promises.readFile(lockfileLoc, 'utf8'));
    const oldLockHash = await fs_1.default.promises.readFile(hashLoc, 'utf8').catch(() => '');
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
function getAliasType(val) {
    if (isRemoteUrl(val)) {
        return 'url';
    }
    return !path_1.default.isAbsolute(val) ? 'package' : 'path';
}
/**
 * For the given import specifier, return an alias entry if one is matched.
 */
function findMatchingAliasEntry(config, spec) {
    // Only match bare module specifiers. relative and absolute imports should not match
    if (isPathImport(spec) || isRemoteUrl(spec)) {
        return undefined;
    }
    for (const [from, to] of Object.entries(config.alias)) {
        const isExactMatch = spec === from;
        const isDeepMatch = spec.startsWith(addTrailingSlash(from));
        if (isExactMatch || isDeepMatch) {
            return {
                from,
                to,
                type: getAliasType(to),
            };
        }
    }
}
exports.findMatchingAliasEntry = findMatchingAliasEntry;
/**
 * Get the most specific file extension match possible.
 */
function getExtensionMatch(fileName, extensionMap) {
    let extensionPartial;
    let extensionMatch;
    // If a full URL is given, start at the basename. Otherwise, start at zero.
    let extensionMatchIndex = Math.max(0, fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'));
    // Grab expanded file extensions, from longest to shortest.
    while (!extensionMatch && extensionMatchIndex > -1) {
        extensionMatchIndex++;
        extensionMatchIndex = fileName.indexOf('.', extensionMatchIndex);
        extensionPartial = fileName.substr(extensionMatchIndex).toLowerCase();
        extensionMatch = extensionMap[extensionPartial];
    }
    // Return the first match, if one was found. Otherwise, return undefined.
    return extensionMatch ? [extensionPartial, extensionMatch] : undefined;
}
exports.getExtensionMatch = getExtensionMatch;
function isPathImport(spec) {
    return spec[0] === '.' || spec[0] === '/';
}
exports.isPathImport = isPathImport;
function isRemoteUrl(val) {
    var _a;
    return val.startsWith('//') || !!((_a = url_1.default.parse(val).protocol) === null || _a === void 0 ? void 0 : _a.startsWith('http'));
}
exports.isRemoteUrl = isRemoteUrl;
function isImportOfPackage(importUrl, packageName) {
    return packageName === importUrl || importUrl.startsWith(packageName + '/');
}
exports.isImportOfPackage = isImportOfPackage;
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
/** URL relative */
function relativeURL(path1, path2) {
    let url = path_1.default.relative(path1, path2).replace(/\\/g, '/');
    if (!url.startsWith('./') && !url.startsWith('../')) {
        url = './' + url;
    }
    return url;
}
exports.relativeURL = relativeURL;
const CLOSING_HEAD_TAG = /<\s*\/\s*head\s*>/gi;
/** Append HTML before closing </head> tag */
function appendHtmlToHead(doc, htmlToAdd) {
    const closingHeadMatch = doc.match(CLOSING_HEAD_TAG);
    // if no <head> tag found, throw an error (we can’t load your app properly)
    if (!closingHeadMatch) {
        throw new Error(`No <head> tag found in HTML (this is needed to optimize your app):\n${doc}`);
    }
    // if multiple <head> tags found, also freak out
    if (closingHeadMatch.length > 1) {
        throw new Error(`Multiple <head> tags found in HTML (perhaps commented out?):\n${doc}`);
    }
    return doc.replace(closingHeadMatch[0], htmlToAdd + closingHeadMatch[0]);
}
exports.appendHtmlToHead = appendHtmlToHead;
function isJavaScript(pathname) {
    const ext = path_1.default.extname(pathname).toLowerCase();
    return ext === '.js' || ext === '.mjs' || ext === '.cjs';
}
exports.isJavaScript = isJavaScript;
function getExtension(str) {
    return path_1.default.extname(str).toLowerCase();
}
exports.getExtension = getExtension;
function hasExtension(str, ext) {
    return new RegExp(`\\${ext}$`, 'i').test(str);
}
exports.hasExtension = hasExtension;
function replaceExtension(fileName, oldExt, newExt) {
    const extToReplace = new RegExp(`\\${oldExt}$`, 'i');
    return fileName.replace(extToReplace, newExt);
}
exports.replaceExtension = replaceExtension;
function addExtension(fileName, newExt) {
    return fileName + newExt;
}
exports.addExtension = addExtension;
function removeExtension(fileName, oldExt) {
    return replaceExtension(fileName, oldExt, '');
}
exports.removeExtension = removeExtension;
/** Add / to beginning of string (but don’t double-up) */
function addLeadingSlash(path) {
    return path.replace(/^\/?/, '/');
}
exports.addLeadingSlash = addLeadingSlash;
/** Add / to the end of string (but don’t double-up) */
function addTrailingSlash(path) {
    return path.replace(/\/?$/, '/');
}
exports.addTrailingSlash = addTrailingSlash;
/** Remove \ and / from beginning of string */
function removeLeadingSlash(path) {
    return path.replace(/^[/\\]+/, '');
}
exports.removeLeadingSlash = removeLeadingSlash;
/** Remove \ and / from end of string */
function removeTrailingSlash(path) {
    return path.replace(/[/\\]+$/, '');
}
exports.removeTrailingSlash = removeTrailingSlash;
/** It's `Array.splice`, but for Strings! */
function spliceString(source, withSlice, start, end) {
    return source.slice(0, start) + (withSlice || '') + source.slice(end);
}
exports.spliceString = spliceString;
exports.HMR_CLIENT_CODE = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../assets/hmr-client.js'), 'utf8');
exports.HMR_OVERLAY_CODE = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../assets/hmr-error-overlay.js'), 'utf8');
exports.INIT_TEMPLATE_FILE = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../assets/snowpack-init-file.js'), 'utf8');
