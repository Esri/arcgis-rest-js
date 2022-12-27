"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBuiltInOptimize = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const esbuild = __importStar(require("esbuild"));
const fs_1 = require("fs");
const fdir_1 = require("fdir");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../logger");
const util_1 = require("../util");
const file_urls_1 = require("./file-urls");
// We want to output our bundled build directly into our build directory, but esbuild
// has a bug where it complains about overwriting source files even when write: false.
// We create a fake bundle directory for now. Nothing ever actually gets written here.
const FAKE_BUILD_DIRECTORY = path_1.default.join(process.cwd(), '~~bundle~~');
const FAKE_BUILD_DIRECTORY_REGEX = /.*\~\~bundle\~\~[\\\/]/;
/** Collect deep imports in the given set, recursively. */
function collectDeepImports(config, url, manifest, set) {
    const buildPrefix = util_1.removeLeadingSlash(config.buildOptions.out.replace(process.cwd(), ''))
        .split(path_1.default.sep)
        .join(path_1.default.posix.sep);
    const normalizedUrl = !url.startsWith(buildPrefix) ? path_1.default.posix.join(buildPrefix, url) : url;
    const relativeImportUrl = url.replace(buildPrefix, '');
    if (set.has(relativeImportUrl)) {
        return;
    }
    set.add(relativeImportUrl);
    const manifestEntry = manifest.inputs[normalizedUrl];
    if (!manifestEntry) {
        throw new Error('Not Found in manifest: ' + normalizedUrl);
    }
    manifestEntry.imports.forEach(({ path }) => collectDeepImports(config, path, manifest, set));
    return;
}
/**
 * Scan a collection of HTML files for entrypoints. A file is deemed an "html entrypoint"
 * if it contains an <html> element. This prevents partials from being scanned.
 */
async function scanHtmlEntrypoints(htmlFiles) {
    return Promise.all(htmlFiles.map(async (htmlFile) => {
        const code = await fs_1.promises.readFile(htmlFile, 'utf8');
        const root = cheerio_1.default.load(code, { decodeEntities: false });
        const isHtmlFragment = root.html().startsWith('<html><head></head><body>');
        if (isHtmlFragment) {
            return null;
        }
        return {
            file: htmlFile,
            root,
            getScripts: () => root('script[type="module"]'),
            getStyles: () => root('style'),
            getLinks: (rel) => root(`link[rel="${rel}"]`),
        };
    }));
}
async function extractBaseUrl(htmlData, baseUrl) {
    const { root, getScripts, getLinks } = htmlData;
    if (!baseUrl || baseUrl === '/') {
        return;
    }
    getScripts().each((_, elem) => {
        const scriptRoot = root(elem);
        const scriptSrc = scriptRoot.attr('src');
        if (!scriptSrc || !scriptSrc.startsWith(baseUrl)) {
            return;
        }
        scriptRoot.attr('src', util_1.addLeadingSlash(scriptSrc.replace(baseUrl, '')));
        scriptRoot.attr('snowpack-baseurl', 'true');
    });
    getLinks('stylesheet').each((_, elem) => {
        const linkRoot = root(elem);
        const styleHref = linkRoot.attr('href');
        if (!styleHref || !styleHref.startsWith(baseUrl)) {
            return;
        }
        linkRoot.attr('href', util_1.addLeadingSlash(styleHref.replace(baseUrl, '')));
        linkRoot.attr('snowpack-baseurl', 'true');
    });
}
async function restitchBaseUrl(htmlData, baseUrl) {
    const { root, getScripts, getLinks } = htmlData;
    getScripts()
        .filter('[snowpack-baseurl]')
        .each((_, elem) => {
        const scriptRoot = root(elem);
        const scriptSrc = scriptRoot.attr('src');
        scriptRoot.attr('src', util_1.removeTrailingSlash(baseUrl) + util_1.addLeadingSlash(scriptSrc));
        scriptRoot.removeAttr('snowpack-baseurl');
    });
    getLinks('stylesheet')
        .filter('[snowpack-baseurl]')
        .each((_, elem) => {
        const linkRoot = root(elem);
        const styleHref = linkRoot.attr('href');
        linkRoot.attr('href', util_1.removeTrailingSlash(baseUrl) + util_1.addLeadingSlash(styleHref));
        linkRoot.removeAttr('snowpack-baseurl');
    });
}
async function extractInlineScripts(htmlData) {
    const { file, root, getScripts, getStyles } = htmlData;
    getScripts().each((i, elem) => {
        const scriptRoot = root(elem);
        const scriptContent = scriptRoot.contents().text();
        if (!scriptContent) {
            return;
        }
        scriptRoot.empty();
        fs_1.writeFileSync(file + `.inline.${i}.js`, scriptContent);
        scriptRoot.attr('src', `./${path_1.default.basename(file)}.inline.${i}.js`);
        scriptRoot.attr('snowpack-inline', `true`);
    });
    getStyles().each((i, elem) => {
        const styleRoot = root(elem);
        const styleContent = styleRoot.contents().text();
        if (!styleContent) {
            return;
        }
        styleRoot.after(`<link rel="stylesheet" href="./${path_1.default.basename(file)}.inline.${i}.css" snowpack-inline="true" />`);
        styleRoot.remove();
        fs_1.writeFileSync(file + `.inline.${i}.css`, styleContent);
    });
}
async function restitchInlineScripts(htmlData) {
    const { file, root, getScripts, getLinks } = htmlData;
    getScripts()
        .filter('[snowpack-inline]')
        .each((_, elem) => {
        const scriptRoot = root(elem);
        const scriptFile = path_1.default.resolve(file, '..', scriptRoot.attr('src'));
        const scriptContent = fs_1.readFileSync(scriptFile, 'utf8');
        scriptRoot.text(scriptContent);
        scriptRoot.removeAttr('src');
        scriptRoot.removeAttr('snowpack-inline');
        fs_1.unlinkSync(scriptFile);
    });
    getLinks('stylesheet')
        .filter('[snowpack-inline]')
        .each((_, elem) => {
        const linkRoot = root(elem);
        const styleFile = path_1.default.resolve(file, '..', linkRoot.attr('href'));
        const styleContent = fs_1.readFileSync(styleFile, 'utf8');
        const newStyleEl = root('<style></style>');
        newStyleEl.text(styleContent);
        linkRoot.after(newStyleEl);
        linkRoot.remove();
        fs_1.unlinkSync(styleFile);
    });
}
/** Add new bundled CSS files to the HTML entrypoint file, if not already there. */
function addNewBundledCss(htmlData, manifest, baseUrl) {
    if (!manifest.outputs) {
        return;
    }
    for (const key of Object.keys(manifest.outputs)) {
        if (!util_1.hasExtension(key, '.css')) {
            continue;
        }
        const scriptKey = key.replace('.css', '.js');
        if (!manifest.outputs[scriptKey]) {
            continue;
        }
        const hasCssImportAlready = htmlData
            .getLinks('stylesheet')
            .toArray()
            .some((v) => {
            const { attribs } = v;
            return attribs && attribs.href.includes(util_1.removeLeadingSlash(key));
        });
        const hasScriptImportAlready = htmlData
            .getScripts()
            .toArray()
            .some((v) => {
            const { attribs } = v;
            return attribs && attribs.src.includes(util_1.removeLeadingSlash(scriptKey));
        });
        if (hasCssImportAlready || !hasScriptImportAlready) {
            continue;
        }
        const linkHref = util_1.removeTrailingSlash(baseUrl) + util_1.addLeadingSlash(key);
        htmlData.root('head').append(`<link rel="stylesheet" href="${linkHref}" />`);
    }
}
/**
 * Traverse the entrypoint for JS scripts, and add preload links to the HTML entrypoint.
 */
function preloadEntrypoint(htmlData, manifest, config) {
    const { root, getScripts } = htmlData;
    const preloadScripts = getScripts()
        .map((_, elem) => {
        const { attribs } = elem;
        return attribs.src;
    })
        .get()
        .filter(util_1.isTruthy);
    const collectedDeepImports = new Set();
    for (const preloadScript of preloadScripts) {
        collectDeepImports(config, preloadScript, manifest, collectedDeepImports);
    }
    const baseUrl = config.buildOptions.baseUrl;
    for (const imp of collectedDeepImports) {
        const preloadUrl = (baseUrl ? util_1.removeTrailingSlash(baseUrl) : '') + util_1.addLeadingSlash(imp);
        root('head').append(`<link rel="modulepreload" href="${preloadUrl}" />`);
    }
}
/**
 * Handle the many different user input formats to return an array of strings.
 * resolve "auto" mode here.
 */
async function getEntrypoints(entrypoints, allBuildFiles) {
    if (entrypoints === 'auto') {
        // TODO: Filter allBuildFiles by HTML with head & body
        return allBuildFiles.filter((f) => util_1.hasExtension(f, '.html'));
    }
    if (Array.isArray(entrypoints)) {
        return entrypoints;
    }
    if (typeof entrypoints === 'function') {
        return entrypoints({ files: allBuildFiles });
    }
    throw new Error('UNEXPECTED ENTRYPOINTS: ' + entrypoints);
}
/**
 * Resolve an array of string entrypoints to absolute file paths. Handle
 * source vs. build directory relative entrypoints here as well.
 */
async function resolveEntrypoints(entrypoints, cwd, buildDirectoryLoc, config) {
    return Promise.all(entrypoints.map(async (entrypoint) => {
        if (path_1.default.isAbsolute(entrypoint)) {
            return entrypoint;
        }
        const buildEntrypoint = path_1.default.resolve(buildDirectoryLoc, entrypoint);
        if (await fs_1.promises.stat(buildEntrypoint).catch(() => null)) {
            return buildEntrypoint;
        }
        const resolvedSourceFile = path_1.default.resolve(cwd, entrypoint);
        let resolvedSourceEntrypoint;
        if (await fs_1.promises.stat(resolvedSourceFile).catch(() => null)) {
            const resolvedSourceUrls = file_urls_1.getUrlsForFile(resolvedSourceFile, config);
            if (resolvedSourceUrls) {
                resolvedSourceEntrypoint = path_1.default.resolve(buildDirectoryLoc, util_1.removeLeadingSlash(resolvedSourceUrls[0]));
                if (await fs_1.promises.stat(resolvedSourceEntrypoint).catch(() => null)) {
                    return resolvedSourceEntrypoint;
                }
            }
        }
        logger_1.logger.error(`Error: entrypoint "${entrypoint}" not found in either build or source:`, {
            name: 'optimize',
        });
        logger_1.logger.error(`  ✘ Build Entrypoint: ${buildEntrypoint}`, { name: 'optimize' });
        logger_1.logger.error(`  ✘ Source Entrypoint: ${resolvedSourceFile} ${resolvedSourceEntrypoint ? `-> ${resolvedSourceEntrypoint}` : ''}`, { name: 'optimize' });
        throw new Error(`Optimize entrypoint "${entrypoint}" does not exist.`);
    }));
}
/**
 * Process your entrypoints as either all JS or all HTML. If HTML,
 * scan those HTML files and add a Cheerio-powered root document
 * so that we can modify the HTML files as we go.
 */
async function processEntrypoints(originalEntrypointValue, entrypointFiles, buildDirectoryLoc, baseUrl) {
    // If entrypoints are JS:
    if (entrypointFiles.every((f) => util_1.hasExtension(f, '.js'))) {
        return { htmlEntrypoints: null, bundleEntrypoints: entrypointFiles };
    }
    // If entrypoints are HTML:
    if (entrypointFiles.every((f) => util_1.hasExtension(f, '.html'))) {
        const rawHtmlEntrypoints = await scanHtmlEntrypoints(entrypointFiles);
        const htmlEntrypoints = rawHtmlEntrypoints.filter(util_1.isTruthy);
        if (originalEntrypointValue !== 'auto' &&
            rawHtmlEntrypoints.length !== htmlEntrypoints.length) {
            throw new Error('INVALID HTML ENTRYPOINTS: ' + originalEntrypointValue);
        }
        htmlEntrypoints.forEach((val) => extractBaseUrl(val, baseUrl));
        htmlEntrypoints.forEach(extractInlineScripts);
        const bundleEntrypoints = Array.from(htmlEntrypoints.reduce((all, val) => {
            val.getLinks('stylesheet').each((_, elem) => {
                const { attribs } = elem;
                if (!attribs || !attribs.href || util_1.isRemoteUrl(attribs.href)) {
                    return;
                }
                const resolvedCSS = attribs.href[0] === '/'
                    ? path_1.default.resolve(buildDirectoryLoc, util_1.removeLeadingSlash(attribs.href))
                    : path_1.default.resolve(val.file, '..', attribs.href);
                all.add(resolvedCSS);
            });
            val.getScripts().each((_, elem) => {
                const { attribs } = elem;
                if (!attribs.src || util_1.isRemoteUrl(attribs.src)) {
                    return;
                }
                const resolvedJS = attribs.src[0] === '/'
                    ? path_1.default.join(buildDirectoryLoc, util_1.removeLeadingSlash(attribs.src))
                    : path_1.default.join(val.file, '..', attribs.src);
                all.add(resolvedJS);
            });
            return all;
        }, new Set()));
        return { htmlEntrypoints, bundleEntrypoints };
    }
    // If entrypoints are mixed or neither, throw an error.
    throw new Error('MIXED ENTRYPOINTS: ' + entrypointFiles);
}
/**
 * Run esbuild on the build directory. This is run regardless of bundle=true or false,
 * since we use the generated manifest in either case.
 */
async function runEsbuildOnBuildDirectory(bundleEntrypoints, allFiles, config) {
    var _a, _b, _c;
    // esbuild requires publicPath to be a remote URL. Only pass to esbuild if baseUrl is remote.
    let publicPath;
    if (config.buildOptions.baseUrl.startsWith('http:') ||
        config.buildOptions.baseUrl.startsWith('https:') ||
        config.buildOptions.baseUrl.startsWith('//')) {
        publicPath = config.buildOptions.baseUrl;
    }
    const { outputFiles, warnings, metafile } = await esbuild.build({
        entryPoints: bundleEntrypoints,
        outdir: FAKE_BUILD_DIRECTORY,
        outbase: config.buildOptions.out,
        write: false,
        bundle: true,
        loader: config.optimize.loader,
        sourcemap: config.optimize.sourcemap,
        splitting: config.optimize.splitting,
        format: 'esm',
        platform: 'browser',
        metafile: true,
        publicPath,
        minify: config.optimize.minify,
        target: config.optimize.target,
        external: Array.from(new Set(allFiles.map((f) => '*' + path_1.default.extname(f))))
            .filter((ext) => ext !== '*.js' && ext !== '*.mjs' && ext !== '*.css' && ext !== '*')
            .concat((_b = (_a = config.packageOptions) === null || _a === void 0 ? void 0 : _a.external) !== null && _b !== void 0 ? _b : []),
        charset: 'utf8',
    });
    if (!outputFiles) {
        throw new Error('EMPTY BUILD');
    }
    if (warnings.length > 0) {
        console.warn(warnings);
    }
    outputFiles.forEach((f) => {
        f.path = f.path.replace(FAKE_BUILD_DIRECTORY_REGEX, util_1.addTrailingSlash(config.buildOptions.out));
    });
    const manifest = metafile;
    if (!((_c = config.optimize) === null || _c === void 0 ? void 0 : _c.bundle)) {
        delete manifest.outputs;
    }
    else {
        Object.entries(manifest.outputs).forEach(([f, val]) => {
            const newKey = f.replace(FAKE_BUILD_DIRECTORY_REGEX, '/');
            manifest.outputs[newKey] = val;
            delete manifest.outputs[f];
        });
    }
    logger_1.logger.debug(`outputFiles: ${JSON.stringify(outputFiles.map((f) => f.path))}`);
    logger_1.logger.debug(`manifest: ${JSON.stringify(manifest)}`);
    return { outputFiles, manifest };
}
/** The main optimize function: runs optimization on a build directory. */
async function runBuiltInOptimize(config) {
    const originalCwd = process.cwd();
    const buildDirectoryLoc = config.buildOptions.out;
    const options = config.optimize;
    if (!options) {
        return;
    }
    // * Scan to collect all build files: We'll need this throughout.
    const allBuildFiles = (await new fdir_1.fdir()
        .withFullPaths()
        .crawl(buildDirectoryLoc)
        .withPromise());
    // * Resolve and validate your entrypoints: they may be JS or HTML
    const userEntrypoints = await getEntrypoints(options.entrypoints, allBuildFiles);
    logger_1.logger.debug(JSON.stringify(userEntrypoints), { name: 'optimize.entrypoints' });
    const resolvedEntrypoints = await resolveEntrypoints(userEntrypoints, originalCwd, buildDirectoryLoc, config);
    logger_1.logger.debug('(resolved) ' + JSON.stringify(resolvedEntrypoints), { name: 'optimize.entrypoints' });
    const { htmlEntrypoints, bundleEntrypoints } = await processEntrypoints(options.entrypoints, resolvedEntrypoints, buildDirectoryLoc, config.buildOptions.baseUrl);
    logger_1.logger.debug(`htmlEntrypoints: ${JSON.stringify(htmlEntrypoints === null || htmlEntrypoints === void 0 ? void 0 : htmlEntrypoints.map((f) => f.file))}`);
    logger_1.logger.debug(`bundleEntrypoints: ${JSON.stringify(bundleEntrypoints)}`);
    if ((!htmlEntrypoints || htmlEntrypoints.length === 0) &&
        bundleEntrypoints.length === 0 &&
        (options.bundle || options.preload)) {
        throw new Error('[optimize] No HTML entrypoints detected. Set "entrypoints" manually if your site HTML is generated outside of Snowpack (SSR, Rails, PHP, etc.).');
    }
    // * Run esbuild on the entire build directory. Even if you are not writing the result
    // to disk (bundle: false), we still use the bundle manifest as an in-memory representation
    // of our import graph, saved to disk.
    const { manifest, outputFiles } = await runEsbuildOnBuildDirectory(bundleEntrypoints, allBuildFiles, config);
    // * BUNDLE: TRUE - Save the bundle result to the build directory, and clean up to remove all original
    // build files that now live in the bundles.
    if (options.bundle) {
        for (const bundledInput of Object.keys(manifest.inputs)) {
            const outputKey = path_1.default.relative(buildDirectoryLoc, path_1.default.resolve(process.cwd(), bundledInput));
            if (!manifest.outputs[`/` + outputKey]) {
                logger_1.logger.debug(`Removing bundled source file: ${path_1.default.resolve(buildDirectoryLoc, outputKey)}`);
                util_1.deleteFromBuildSafe(path_1.default.resolve(buildDirectoryLoc, outputKey), config);
            }
        }
        util_1.deleteFromBuildSafe(path_1.default.resolve(buildDirectoryLoc, util_1.removeLeadingSlash(path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg'))), config);
        for (const outputFile of outputFiles) {
            mkdirp_1.default.sync(path_1.default.dirname(outputFile.path));
            await fs_1.promises.writeFile(outputFile.path, outputFile.contents);
        }
        if (htmlEntrypoints) {
            for (const htmlEntrypoint of htmlEntrypoints) {
                addNewBundledCss(htmlEntrypoint, manifest, config.buildOptions.baseUrl);
            }
        }
    }
    // * BUNDLE: FALSE - Just minifying & transform the CSS & JS files in place.
    else if (options.minify || options.target) {
        for (const f of allBuildFiles) {
            if (['.js', '.css'].includes(path_1.default.extname(f))) {
                let code = await fs_1.promises.readFile(f, 'utf8');
                const minified = await esbuild.transform(code, {
                    sourcefile: path_1.default.basename(f),
                    loader: path_1.default.extname(f).slice(1),
                    minify: options.minify,
                    target: options.target,
                    charset: 'utf8',
                });
                code = minified.code;
                await fs_1.promises.writeFile(f, code);
            }
        }
    }
    // * Restitch any inline scripts into HTML entrypoints that had been split out
    // for the sake of bundling/manifest.
    if (htmlEntrypoints) {
        for (const htmlEntrypoint of htmlEntrypoints) {
            restitchInlineScripts(htmlEntrypoint);
        }
    }
    // * PRELOAD: TRUE - Add preload link elements for each HTML entrypoint, to flatten
    // and optimize any deep import waterfalls.
    if (options.preload) {
        if (options.bundle) {
            throw new Error('preload is not needed when bundle=true, and cannot be used in combination.');
        }
        if (!htmlEntrypoints || htmlEntrypoints.length === 0) {
            throw new Error('preload only works with HTML entrypoints.');
        }
        for (const htmlEntrypoint of htmlEntrypoints) {
            preloadEntrypoint(htmlEntrypoint, manifest, config);
        }
    }
    // * Restitch any inline scripts into HTML entrypoints that had been split out
    // for the sake of bundling/manifest.
    if (htmlEntrypoints) {
        for (const htmlEntrypoint of htmlEntrypoints) {
            restitchBaseUrl(htmlEntrypoint, config.buildOptions.baseUrl);
        }
    }
    // Write the final HTML entrypoints to disk (if they exist).
    if (htmlEntrypoints) {
        for (const htmlEntrypoint of htmlEntrypoints) {
            await fs_1.promises.writeFile(htmlEntrypoint.file, htmlEntrypoint.root.html());
        }
    }
    // Write the final build manifest to disk.
    if (options.manifest) {
        await fs_1.promises.writeFile(path_1.default.join(config.buildOptions.out, 'build-manifest.json'), JSON.stringify(manifest));
    }
    process.chdir(originalCwd);
    return;
}
exports.runBuiltInOptimize = runBuiltInOptimize;
