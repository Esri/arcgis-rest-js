"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImportGlobResolver = exports.createImportResolver = exports.getFsStat = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const slash_1 = __importDefault(require("slash"));
const util_1 = require("../util");
const file_urls_1 = require("./file-urls");
const glob_1 = __importDefault(require("glob"));
/** Perform a file disk lookup for the requested import specifier. */
function getFsStat(importedFileOnDisk) {
    try {
        return fs_1.default.statSync(importedFileOnDisk);
    }
    catch (err) {
        // file doesn't exist, that's fine
    }
    return false;
}
exports.getFsStat = getFsStat;
/** Resolve an import based on the state of the file/folder found on disk. */
function resolveSourceSpecifier(lazyFileLoc, { parentFile, config }) {
    const lazyFileStat = getFsStat(lazyFileLoc);
    if (lazyFileStat && lazyFileStat.isFile()) {
        lazyFileLoc = lazyFileLoc;
    }
    else if (util_1.hasExtension(lazyFileLoc, '.js')) {
        const tsWorkaroundImportFileLoc = util_1.replaceExtension(lazyFileLoc, '.js', '.ts');
        if (getFsStat(tsWorkaroundImportFileLoc)) {
            lazyFileLoc = tsWorkaroundImportFileLoc;
        }
    }
    else if (util_1.hasExtension(lazyFileLoc, '.jsx')) {
        const tsWorkaroundImportFileLoc = util_1.replaceExtension(lazyFileLoc, '.jsx', '.tsx');
        if (getFsStat(tsWorkaroundImportFileLoc)) {
            lazyFileLoc = tsWorkaroundImportFileLoc;
        }
    }
    else {
        // missing extension
        if (getFsStat(lazyFileLoc + path_1.default.extname(parentFile))) {
            // first, try parent file’s extension
            lazyFileLoc = lazyFileLoc + path_1.default.extname(parentFile);
        }
        else {
            // otherwise, try and match any extension from the extension map
            for (const [ext, outputExts] of Object.entries(config._extensionMap)) {
                if (!outputExts.includes('.js'))
                    continue; // only look through .js-friendly extensions
                if (getFsStat(lazyFileLoc + ext)) {
                    lazyFileLoc = lazyFileLoc + ext;
                    break;
                }
            }
        }
        if (!path_1.default.extname(lazyFileLoc)) {
            if (lazyFileStat && lazyFileStat.isDirectory()) {
                // Handle directory imports (ex: "./components" -> "./components/index.js")
                const trailingSlash = lazyFileLoc.endsWith(path_1.default.sep) ? '' : path_1.default.sep;
                lazyFileLoc = lazyFileLoc + trailingSlash + 'index.js';
            }
            else {
                // Fall back to .js.
                lazyFileLoc = lazyFileLoc + '.js';
            }
        }
    }
    // Transform the file extension (from input to output)
    const extensionMatch = util_1.getExtensionMatch(lazyFileLoc, config._extensionMap);
    if (extensionMatch) {
        const [inputExt, outputExts] = extensionMatch;
        if (outputExts.length > 1) {
            lazyFileLoc = util_1.addExtension(lazyFileLoc, outputExts[0]);
        }
        else {
            lazyFileLoc = util_1.replaceExtension(lazyFileLoc, inputExt, outputExts[0]);
        }
    }
    const resolvedUrls = file_urls_1.getUrlsForFile(lazyFileLoc, config);
    return resolvedUrls ? resolvedUrls[0] : resolvedUrls;
}
/**
 * Create a import resolver function, which converts any import relative to the given file at "fileLoc"
 * to a proper URL. Returns false if no matching import was found, which usually indicates a package
 * not found in the import map.
 */
function createImportResolver({ fileLoc, config }) {
    return function importResolver(spec) {
        var _a;
        // Ignore "http://*" imports
        if (util_1.isRemoteUrl(spec)) {
            return spec;
        }
        // Ignore packages marked as external
        if ((_a = config.packageOptions.external) === null || _a === void 0 ? void 0 : _a.includes(spec)) {
            return spec;
        }
        if (spec[0] === '/') {
            return spec;
        }
        if (spec[0] === '.') {
            const importedFileLoc = path_1.default.resolve(path_1.default.dirname(fileLoc), path_1.default.normalize(spec));
            return resolveSourceSpecifier(importedFileLoc, { parentFile: fileLoc, config }) || spec;
        }
        const aliasEntry = util_1.findMatchingAliasEntry(config, spec);
        if (aliasEntry && (aliasEntry.type === 'path' || aliasEntry.type === 'url')) {
            const { from, to } = aliasEntry;
            let result = spec.replace(from, to);
            if (aliasEntry.type === 'url') {
                return result;
            }
            const importedFileLoc = path_1.default.resolve(config.root, result);
            return resolveSourceSpecifier(importedFileLoc, { parentFile: fileLoc, config }) || spec;
        }
        return false;
    };
}
exports.createImportResolver = createImportResolver;
function toPath(url) {
    return url.replace(/\//g, path_1.default.sep);
}
/**
 * Create a import glob resolver function, which converts any import globs relative to the given file at "fileLoc"
 * to a local file. These will additionally be transformed by the regular import resolver, so they do not need
 * to be finalized just yet
 */
function createImportGlobResolver({ fileLoc, config, }) {
    const rootDir = path_1.default.parse(process.cwd()).root;
    return async function importGlobResolver(spec) {
        let searchSpec = toPath(spec);
        if (spec.startsWith('/')) {
            searchSpec = path_1.default.join(config.root, spec);
        }
        const aliasEntry = util_1.findMatchingAliasEntry(config, spec);
        if (aliasEntry && aliasEntry.type === 'path') {
            const { from, to } = aliasEntry;
            searchSpec = searchSpec.replace(from, to);
            searchSpec = path_1.default.resolve(config.root, searchSpec);
        }
        if (!searchSpec.startsWith(rootDir) && !searchSpec.startsWith('.')) {
            throw new Error(`Glob imports must be relative (starting with ".") or absolute (starting with "/", which is treated as relative to project root)`);
        }
        if (searchSpec.startsWith(rootDir)) {
            searchSpec = path_1.default.resolve(config.root, searchSpec);
            searchSpec = path_1.default.relative(path_1.default.dirname(fileLoc), searchSpec);
        }
        const resolved = await new Promise((resolve, reject) => glob_1.default(searchSpec, { cwd: path_1.default.dirname(fileLoc), nodir: true }, (err, matches) => {
            if (err) {
                return reject(err);
            }
            return resolve(matches);
        }));
        return resolved
            .map((fileLoc) => {
            const normalized = slash_1.default(fileLoc);
            if (normalized.startsWith('.') || normalized.startsWith('/'))
                return normalized;
            return `./${normalized}`;
        })
            .filter((_fileLoc) => {
            // If final import *might* be the same as the source file, double check to avoid importing self
            const finalImportAbsolute = slash_1.default(path_1.default.resolve(path_1.default.dirname(fileLoc), toPath(_fileLoc)));
            return slash_1.default(finalImportAbsolute) !== slash_1.default(fileLoc);
        });
    };
}
exports.createImportGlobResolver = createImportGlobResolver;
