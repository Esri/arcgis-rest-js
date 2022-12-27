"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explodeExportMap = exports.resolveEntrypoint = exports.findExportMapEntry = exports.findManifestEntry = exports.MAIN_FIELDS = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const builtin_modules_1 = __importDefault(require("builtin-modules"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const util_1 = require("./util");
const resolve_1 = __importDefault(require("resolve"));
const picomatch_1 = __importDefault(require("picomatch"));
exports.MAIN_FIELDS = [
    'browser:module',
    'module',
    'browser',
    'main:esnext',
    'jsnext:main',
    'main',
];
// Rarely, a package will ship a broken "browser" package.json entrypoint.
// Ignore the "browser" entrypoint in those packages.
const BROKEN_BROWSER_ENTRYPOINT = ['@sheerun/mutationobserver-shim'];
const FILE_EXTENSION_REGEX = /\..+$/;
function getMissingEntrypointHint(packageEntrypoint, normalizedMap) {
    const noExtensionEntrypoint = './' + packageEntrypoint.replace(FILE_EXTENSION_REGEX, '');
    if (Reflect.get(normalizedMap, noExtensionEntrypoint)) {
        return `Did you mean "${noExtensionEntrypoint}"?`;
    }
    const jsExtensionEntrypoint = './' + packageEntrypoint.replace(FILE_EXTENSION_REGEX, '.js');
    if (Reflect.get(normalizedMap, jsExtensionEntrypoint)) {
        return `Did you mean "${jsExtensionEntrypoint}"?`;
    }
    const cjsExtensionEntrypoint = './' + packageEntrypoint.replace(FILE_EXTENSION_REGEX, '.cjs');
    if (Reflect.get(normalizedMap, cjsExtensionEntrypoint)) {
        return `Did you mean "${cjsExtensionEntrypoint}"?`;
    }
    const mjsExtensionEntrypoint = './' + packageEntrypoint.replace(FILE_EXTENSION_REGEX, '.cjs');
    if (Reflect.get(normalizedMap, mjsExtensionEntrypoint)) {
        return `Did you mean "${mjsExtensionEntrypoint}"?`;
    }
    const directoryEntrypoint = './' + packageEntrypoint + '/index.js';
    if (Reflect.get(normalizedMap, directoryEntrypoint)) {
        return `Did you mean "${directoryEntrypoint}"?`;
    }
}
/**
 *
 */
function findManifestEntry(manifest, entry, { packageLookupFields = [], packageName } = {}) {
    let foundEntrypoint;
    if (manifest.exports) {
        foundEntrypoint =
            typeof manifest.exports === 'string'
                ? manifest.exports
                : findExportMapEntry(manifest.exports['.'] || manifest.exports);
        if (typeof foundEntrypoint === 'string') {
            return foundEntrypoint;
        }
    }
    foundEntrypoint = [...packageLookupFields, ...exports.MAIN_FIELDS].map((e) => manifest[e]).find(Boolean);
    if (foundEntrypoint && typeof foundEntrypoint === 'string') {
        return foundEntrypoint;
    }
    if (!(packageName && BROKEN_BROWSER_ENTRYPOINT.includes(packageName))) {
        // Some packages define "browser" as an object. We'll do our best to find the
        // right entrypoint in an entrypoint object, or fail otherwise.
        // See: https://github.com/defunctzombie/package-browser-field-spec
        let browserField = manifest.browser;
        if (typeof browserField === 'string') {
            return browserField;
        }
        else if (typeof browserField === 'object') {
            let browserEntrypoint = (entry && browserField[entry]) ||
                browserField['./index.js'] ||
                browserField['./index'] ||
                browserField['index.js'] ||
                browserField['index'] ||
                browserField['./'] ||
                browserField['.'];
            if (typeof browserEntrypoint === 'string') {
                return browserEntrypoint;
            }
        }
    }
    // If browser object is set but no relevant entrypoint is found, fall back to "main".
    return manifest.main;
}
exports.findManifestEntry = findManifestEntry;
/**
 * Given an ExportMapEntry find the entry point, resolving recursively.
 */
function findExportMapEntry(exportMapEntry, conditions) {
    // If this is a string or undefined we can skip checking for conditions
    if (typeof exportMapEntry === 'string' || typeof exportMapEntry === 'undefined') {
        return exportMapEntry;
    }
    let entry = exportMapEntry;
    if (conditions) {
        for (let condition of conditions) {
            if (entry[condition]) {
                entry = entry[condition];
            }
        }
    }
    return (findExportMapEntry(entry === null || entry === void 0 ? void 0 : entry.browser) ||
        findExportMapEntry(entry === null || entry === void 0 ? void 0 : entry.import) ||
        findExportMapEntry(entry === null || entry === void 0 ? void 0 : entry.default) ||
        findExportMapEntry(entry === null || entry === void 0 ? void 0 : entry.require) ||
        undefined);
}
exports.findExportMapEntry = findExportMapEntry;
/**
 * Resolve a "webDependencies" input value to the correct absolute file location.
 * Supports both npm package names, and file paths relative to the node_modules directory.
 * Follows logic similar to Node's resolution logic, but using a package.json's ESM "module"
 * field instead of the CJS "main" field.
 */
function resolveEntrypoint(dep, { cwd, packageLookupFields }) {
    // We first need to check for an export map in the package.json. If one exists, resolve to it.
    const [packageName, packageEntrypoint] = util_1.parsePackageImportSpecifier(dep);
    const [packageManifestLoc, packageManifest] = util_1.resolveDependencyManifest(packageName, cwd);
    if (packageManifestLoc && packageManifest && typeof packageManifest.exports !== 'undefined') {
        const exportField = packageManifest.exports;
        // If this is a non-main entry point
        if (packageEntrypoint) {
            const normalizedMap = explodeExportMap(exportField, {
                cwd: path_1.default.dirname(packageManifestLoc),
            });
            const mapValue = normalizedMap && Reflect.get(normalizedMap, './' + packageEntrypoint);
            if (typeof mapValue !== 'string') {
                let helpfulHint = normalizedMap && getMissingEntrypointHint(packageEntrypoint, normalizedMap);
                throw new Error(`Package "${packageName}" exists but package.json "exports" does not include entry for "./${packageEntrypoint}".` +
                    (helpfulHint ? `\n${helpfulHint}` : ''));
            }
            return path_1.default.join(packageManifestLoc, '..', mapValue);
        }
        else {
            const exportMapEntry = exportField['.'] || exportField;
            const mapValue = findExportMapEntry(exportMapEntry);
            if (mapValue) {
                return path_1.default.join(packageManifestLoc, '..', mapValue);
            }
        }
    }
    // if, no export map and dep points directly to a file within a package, return that reference.
    if (builtin_modules_1.default.indexOf(dep) === -1 && !validate_npm_package_name_1.default(dep).validForNewPackages) {
        return fs_1.realpathSync.native(resolve_1.default.sync(dep, { basedir: cwd, extensions: ['.js', '.mjs', '.ts', '.jsx', '.tsx'] }));
    }
    // Otherwise, resolve directly to the dep specifier. Note that this supports both
    // "package-name" & "package-name/some/path" where "package-name/some/path/package.json"
    // exists at that lower path, that must be used to resolve. In that case, export
    // maps should not be supported.
    const [depManifestLoc, depManifest] = util_1.resolveDependencyManifest(dep, cwd);
    if (!depManifest) {
        try {
            const maybeLoc = fs_1.realpathSync.native(resolve_1.default.sync(dep, { basedir: cwd }));
            return maybeLoc;
        }
        catch (_a) {
            // Oh well, was worth a try
        }
    }
    if (!depManifestLoc || !depManifest) {
        if (path_1.default.extname(dep) === '.css') {
            const parts = dep.split('/');
            let npmName = parts.shift();
            if (npmName && npmName.startsWith('@'))
                npmName += '/' + parts.shift();
            throw new Error(`Module "${dep}" not found.
    If you‘re trying to CSS file from your project, try "./${dep}".
    If you‘re trying to import an NPM package, try running \`npm install ${npmName}\` and re-running Snowpack.`);
        }
        throw new Error(`Package "${dep}" not found. Have you installed it? ${depManifestLoc ? depManifestLoc : ''}`);
    }
    let foundEntrypoint = findManifestEntry(depManifest, dep, {
        packageName,
        packageLookupFields,
    });
    // Sometimes packages don't give an entrypoint, assuming you'll fall back to "index.js".
    if (!foundEntrypoint) {
        for (let possibleEntrypoint of ['index.js', 'index.json']) {
            try {
                return fs_1.realpathSync.native(resolve_1.default.sync(path_1.default.join(depManifestLoc || '', '..', possibleEntrypoint)));
            }
            catch (_b) { }
        }
        // Couldn't find any entrypoints so throwing
        throw new Error(`Unable to find any entrypoint for "${dep}". It could be a typo, or this package might not have a main entrypoint.`);
    }
    if (typeof foundEntrypoint !== 'string') {
        throw new Error(`"${dep}" has unexpected entrypoint: ${JSON.stringify(foundEntrypoint)}.`);
    }
    const finalPath = path_1.default.join(depManifestLoc || '', '..', foundEntrypoint);
    try {
        return fs_1.realpathSync.native(resolve_1.default.sync(finalPath));
    }
    catch (_c) {
        throw new Error(`We resolved "${dep}" to ${finalPath}, but the file does not exist on disk.`);
    }
}
exports.resolveEntrypoint = resolveEntrypoint;
const picoMatchGlobalOptions = Object.freeze({
    capture: true,
    noglobstar: true,
});
function* forEachExportEntry(exportField) {
    const simpleExportMap = findExportMapEntry(exportField);
    // Handle case where export map is a string, or if there‘s only one file in the entire export map
    if (simpleExportMap) {
        yield ['.', simpleExportMap];
        return undefined;
    }
    for (const [key, val] of Object.entries(exportField)) {
        // skip invalid entries
        if (!key.startsWith('.')) {
            continue;
        }
        yield [key, val];
    }
}
function* forEachWildcardEntry(key, value, cwd) {
    // Creates a regex from a pattern like ./src/extras/*
    let expr = picomatch_1.default.makeRe(value, picoMatchGlobalOptions);
    // The directory, ie ./src/extras
    let valueDirectoryName = path_1.default.dirname(value);
    let valueDirectoryFullPath = path_1.default.join(cwd, valueDirectoryName);
    if (fs_1.existsSync(valueDirectoryFullPath)) {
        let filesInDirectory = fs_1.readdirSync(valueDirectoryFullPath).filter((filepath) => fs_1.statSync(path_1.default.join(valueDirectoryFullPath, filepath)).isFile());
        for (let filename of filesInDirectory) {
            // Create a relative path for this file to match against the regex
            // ex, ./src/extras/one.js
            let relativeFilePath = path_1.default.join(valueDirectoryName, filename);
            let match = expr.exec(relativeFilePath);
            if (match && match[1]) {
                let [matchingPath, matchGroup] = match;
                let normalizedKey = key.replace('*', matchGroup);
                // Normalized to posix paths, like ./src/extras/one.js
                let normalizedFilePath = '.' + path_1.default.posix.sep + matchingPath.split(path_1.default.sep).join(path_1.default.posix.sep);
                // Yield out a non-wildcard match, for ex.
                // ['./src/extras/one', './src/extras/one.js']
                yield [normalizedKey, normalizedFilePath];
            }
        }
    }
}
function* forEachExportEntryExploded(exportField, cwd) {
    for (const [key, val] of forEachExportEntry(exportField)) {
        // Deprecated but we still want to support this.
        // https://nodejs.org/api/packages.html#packages_subpath_folder_mappings
        if (key.endsWith('/')) {
            const keyValue = findExportMapEntry(val);
            if (typeof keyValue !== 'string') {
                continue;
            }
            // There isn't a clear use-case for this, so we are assuming it's not needed for now.
            if (key === './') {
                continue;
            }
            yield* forEachWildcardEntry(key + '*', keyValue + '*', cwd);
            continue;
        }
        // Wildcards https://nodejs.org/api/packages.html#packages_subpath_patterns
        if (key.includes('*')) {
            const keyValue = findExportMapEntry(val);
            if (typeof keyValue !== 'string') {
                continue;
            }
            yield* forEachWildcardEntry(key, keyValue, cwd);
            continue;
        }
        yield [key, val];
    }
}
/**
 * Given an export map and all of the crazy variations, condense down to a key/value map of string keys to string values.
 */
function explodeExportMap(exportField, { cwd }) {
    if (!exportField) {
        return;
    }
    const cleanExportMap = {};
    for (const [key, val] of forEachExportEntryExploded(exportField, cwd)) {
        // If entry is an array, assume that we can always support the first value
        const firstVal = Array.isArray(val) ? val[0] : val;
        // Support these entries, in this order.
        const cleanValue = findExportMapEntry(firstVal);
        if (typeof cleanValue !== 'string') {
            continue;
        }
        cleanExportMap[key] = cleanValue;
    }
    if (Object.keys(cleanExportMap).length === 0) {
        return;
    }
    return cleanExportMap;
}
exports.explodeExportMap = explodeExportMap;
//# sourceMappingURL=entrypoints.js.map