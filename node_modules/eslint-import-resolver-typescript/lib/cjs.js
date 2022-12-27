'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var tsconfigPaths = require('tsconfig-paths');
var glob = require('glob');
var isGlob = _interopDefault(require('is-glob'));
var resolve$1 = require('resolve');
var debug = _interopDefault(require('debug'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var IMPORTER_NAME = 'eslint-import-resolver-typescript';
var log = debug(IMPORTER_NAME);
var defaultExtensions = ['.ts', '.tsx', '.d.ts'].concat(
// eslint-disable-next-line node/no-deprecated-api
Object.keys(require.extensions), '.jsx');
var interfaceVersion = 2;
/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param {TsResolverOptions} options
 */
function resolve(source, file, options) {
    options = options || {};
    log('looking for:', source);
    source = removeQuerystring(source);
    // don't worry about core node modules
    if (resolve$1.isCore(source)) {
        log('matched core:', source);
        return {
            found: true,
            path: null,
        };
    }
    initMappers(options);
    var mappedPath = getMappedPath(source);
    if (mappedPath) {
        log('matched ts path:', mappedPath);
    }
    // note that even if we map the path, we still need to do a final resolve
    var foundNodePath;
    try {
        foundNodePath = tsResolve(mappedPath || source, {
            extensions: options.extensions || defaultExtensions,
            basedir: path.dirname(path.resolve(file)),
            packageFilter: options.packageFilter || packageFilterDefault,
        });
    }
    catch (_a) {
        foundNodePath = null;
    }
    // naive attempt at @types/* resolution,
    // if path is neither absolute nor relative
    if ((/\.jsx?$/.test(foundNodePath) ||
        (options.alwaysTryTypes && !foundNodePath)) &&
        !/^@types[/\\]/.test(source) &&
        !path.isAbsolute(source) &&
        !source.startsWith('.')) {
        var definitelyTyped = resolve('@types' + path.sep + mangleScopedPackage(source), file, options);
        if (definitelyTyped.found) {
            return definitelyTyped;
        }
    }
    if (foundNodePath) {
        log('matched node path:', foundNodePath);
        return {
            found: true,
            path: foundNodePath,
        };
    }
    log("didn't find ", source);
    return {
        found: false,
    };
}
function packageFilterDefault(pkg) {
    pkg.main =
        pkg.types || pkg.typings || pkg.module || pkg['jsnext:main'] || pkg.main;
    return pkg;
}
/**
 * Like `sync` from `resolve` package, but considers that the module id
 * could have a .js or .jsx extension.
 */
function tsResolve(id, opts) {
    try {
        return resolve$1.sync(id, opts);
    }
    catch (error) {
        var idWithoutJsExt = removeJsExtension(id);
        if (idWithoutJsExt !== id) {
            return resolve$1.sync(idWithoutJsExt, opts);
        }
        throw error;
    }
}
/** Remove any trailing querystring from module id. */
function removeQuerystring(id) {
    var querystringIndex = id.lastIndexOf('?');
    if (querystringIndex >= 0) {
        return id.slice(0, querystringIndex);
    }
    return id;
}
/** Remove .js or .jsx extension from module id. */
function removeJsExtension(id) {
    return id.replace(/\.jsx?$/, '');
}
var mappersBuildForOptions;
var mappers;
/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @returns The mapped path of the module or undefined
 */
function getMappedPath(source) {
    var paths = mappers.map(function (mapper) { return mapper(source); }).filter(function (path) { return !!path; });
    if (paths.length > 1) {
        log('found multiple matching ts paths:', paths);
    }
    return paths[0];
}
/**
 * Like `createMatchPath` from `tsconfig-paths` package, but considers
 * that the module id could have a .js or .jsx extension.
 */
var createExtendedMatchPath = function () {
    var createArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        createArgs[_i] = arguments[_i];
    }
    var matchPath = tsconfigPaths.createMatchPath.apply(void 0, createArgs);
    return function (id) {
        var otherArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherArgs[_i - 1] = arguments[_i];
        }
        var match = matchPath.apply(void 0, __spreadArrays([id], otherArgs));
        if (match != null)
            return match;
        var idWithoutJsExt = removeJsExtension(id);
        if (idWithoutJsExt !== id) {
            return matchPath.apply(void 0, __spreadArrays([idWithoutJsExt], otherArgs));
        }
    };
};
function initMappers(options) {
    if (mappers && mappersBuildForOptions === options) {
        return;
    }
    if (options.directory) {
        console.warn("[" + IMPORTER_NAME + "]: option `directory` is deprecated, please use `project` instead");
        if (!options.project) {
            options.project = options.directory;
        }
    }
    var configPaths = typeof options.project === 'string'
        ? [options.project]
        : Array.isArray(options.project)
            ? options.project
            : [process.cwd()];
    mappers = configPaths
        // turn glob patterns into paths
        .reduce(function (paths, path) { return paths.concat(isGlob(path) ? glob.sync(path) : path); }, [])
        // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
        .map(tsconfigPaths.loadConfig)
        // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
        .filter(isConfigLoaderSuccessResult)
        .map(function (configLoaderResult) {
        var matchPath = createExtendedMatchPath(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths);
        return function (source) {
            // look for files based on setup tsconfig "paths"
            return matchPath(source, undefined, undefined, options.extensions || defaultExtensions);
        };
    });
    mappersBuildForOptions = options;
}
function isConfigLoaderSuccessResult(configLoaderResult) {
    if (configLoaderResult.resultType !== 'success') {
        // this can happen if the user has problems with their tsconfig
        // or if it's valid, but they don't have baseUrl set
        log('failed to init tsconfig-paths:', configLoaderResult.message);
        return false;
    }
    return true;
}
/**
 * For a scoped package, we must look in `@types/foo__bar` instead of `@types/@foo/bar`.
 */
function mangleScopedPackage(moduleName) {
    if (moduleName.startsWith('@')) {
        var replaceSlash = moduleName.replace(path.sep, '__');
        if (replaceSlash !== moduleName) {
            return replaceSlash.slice(1); // Take off the "@"
        }
    }
    return moduleName;
}

exports.interfaceVersion = interfaceVersion;
exports.resolve = resolve;
