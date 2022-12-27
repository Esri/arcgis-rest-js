"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebDependencyType = exports.isJavaScript = exports.createInstallTarget = exports.removeTrailingSlash = exports.removeLeadingSlash = exports.addTrailingSlash = exports.addLeadingSlash = exports.getWebDependencyName = exports.sanitizePackageName = exports.getExt = exports.isPackageAliasEntry = exports.findMatchingAliasEntry = exports.MISSING_PLUGIN_SUGGESTIONS = exports.resolveDependencyManifest = exports.parsePackageImportSpecifier = exports.isTruthy = exports.isRemoteUrl = exports.writeLockfile = exports.NATIVE_REQUIRE = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const resolve_1 = __importDefault(require("resolve"));
// We need to use eval here to prevent Rollup from detecting this use of `require()`
exports.NATIVE_REQUIRE = eval('require');
async function writeLockfile(loc, importMap) {
    const sortedImportMap = { imports: {} };
    for (const key of Object.keys(importMap.imports).sort()) {
        sortedImportMap.imports[key] = importMap.imports[key];
    }
    return fs_1.promises.writeFile(loc, JSON.stringify(sortedImportMap, undefined, 2), { encoding: 'utf8' });
}
exports.writeLockfile = writeLockfile;
function isRemoteUrl(val) {
    return /\w+\:\/\//.test(val) || val.startsWith('//');
}
exports.isRemoteUrl = isRemoteUrl;
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
    try {
        // resolve doesn't care about export map rules, so should find a package.json
        // if one does exist.
        const pkgPth = resolve_1.default.sync(`${dep}/package.json`, {
            basedir: cwd,
        });
        const depManifest = fs_1.realpathSync.native(pkgPth);
        return [depManifest, exports.NATIVE_REQUIRE(depManifest)];
    }
    catch (_a) {
        // This shouldn't ever happen if the package does exist.
        return [null, null];
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
/**
 * Formats the snowpack dependency name from a "webDependencies" input value:
 * 2. Remove any ".js"/".mjs" extension (will be added automatically by Rollup)
 */
function getWebDependencyName(dep) {
    return validate_npm_package_name_1.default(dep).validForNewPackages
        ? dep.replace(/\.js$/i, 'js') // if this is a top-level package ending in .js, replace with js (e.g. tippy.js -> tippyjs)
        : dep.replace(/\.m?js$/i, ''); // otherwise simply strip the extension (Rollup will resolve it)
}
exports.getWebDependencyName = getWebDependencyName;
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
function isJavaScript(pathname) {
    const ext = path_1.default.extname(pathname).toLowerCase();
    return ext === '.js' || ext === '.mjs' || ext === '.cjs';
}
exports.isJavaScript = isJavaScript;
/**
 * Detect the web dependency "type" as either JS or ASSET:
 *   - BUNDLE: Install and bundle this file with Rollup engine.
 *   - ASSET: Copy this file directly.
 */
const bundleTypeExtensions = new Set(['.svelte', '.vue', '.astro']);
function getWebDependencyType(pathname) {
    const ext = path_1.default.extname(pathname).toLowerCase();
    // JavaScript should always be bundled.
    if (isJavaScript(pathname)) {
        return 'BUNDLE';
    }
    // Svelte & Vue (& Astro) should always be bundled because we want to show the missing plugin
    // error if a Svelte or Vue or Astro file is the install target. Without this, the .svelte/.vue
    // file would be treated like an asset and sent to the web as-is.
    if (bundleTypeExtensions.has(ext)) {
        return 'BUNDLE';
    }
    // TypeScript typings
    if (pathname.endsWith('.d.ts')) {
        return 'DTS';
    }
    // All other files should be treated as assets (copied over directly).
    return 'ASSET';
}
exports.getWebDependencyType = getWebDependencyType;
//# sourceMappingURL=util.js.map