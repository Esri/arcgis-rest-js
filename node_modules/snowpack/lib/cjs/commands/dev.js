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
exports.command = exports.startServer = exports.NotFoundError = exports.OneToManyMap = void 0;
const compressible_1 = __importDefault(require("compressible"));
const etag_1 = __importDefault(require("etag"));
const events_1 = require("events");
const fs_1 = require("fs");
const fdir_1 = require("fdir");
const picomatch_1 = __importDefault(require("picomatch"));
const http_1 = __importDefault(require("http"));
const http2_1 = __importDefault(require("http2"));
const colors = __importStar(require("kleur/colors"));
const mime_types_1 = __importDefault(require("mime-types"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const perf_hooks_1 = require("perf_hooks");
const slash_1 = __importDefault(require("slash"));
const stream_1 = __importDefault(require("stream"));
const url_1 = __importDefault(require("url"));
const zlib_1 = __importDefault(require("zlib"));
const build_import_proxy_1 = require("../build/build-import-proxy");
const file_builder_1 = require("../build/file-builder");
const file_urls_1 = require("../build/file-urls");
const hmr_1 = require("../dev/hmr");
const logger_1 = require("../logger");
const util_1 = require("../sources/util");
const ssr_loader_1 = require("../ssr-loader");
const util_2 = require("../util");
const paint_1 = require("./paint");
const import_css_1 = require("../build/import-css");
const build_pipeline_1 = require("../build/build-pipeline");
class OneToManyMap {
    constructor() {
        this.keyToValue = new Map();
        this.valueToKey = new Map();
    }
    add(key, _value) {
        const value = Array.isArray(_value) ? _value : [_value];
        this.keyToValue.set(key, value);
        for (const val of value) {
            this.valueToKey.set(val, key);
        }
    }
    delete(key) {
        const value = this.value(key);
        this.keyToValue.delete(key);
        if (value) {
            for (const val of value) {
                this.valueToKey.delete(val);
            }
        }
    }
    key(value) {
        return this.valueToKey.get(value);
    }
    value(key) {
        return this.keyToValue.get(key);
    }
}
exports.OneToManyMap = OneToManyMap;
const FILE_BUILD_RESULT_ERROR = `Build Result Error: There was a problem with a file build result.`;
/**
 * If encoding is defined, return a string. Otherwise, return a Buffer.
 */
function encodeResponse(response, encoding) {
    if (encoding === undefined) {
        return response;
    }
    if (encoding) {
        if (typeof response === 'string') {
            return response;
        }
        else {
            return response.toString(encoding);
        }
    }
    if (typeof response === 'string') {
        return Buffer.from(response);
    }
    else {
        return response;
    }
}
/**
 * A helper class for "Not Found" errors, storing data about what file lookups were attempted.
 */
class NotFoundError extends Error {
    constructor(url, lookups) {
        if (!lookups) {
            super(`Not Found (${url})`);
        }
        else {
            super(`Not Found (${url}):\n${lookups.map((loc) => '  ✘ ' + loc).join('\n')}`);
        }
    }
}
exports.NotFoundError = NotFoundError;
function sendResponseFile(req, res, { contents, originalFileLoc, contentType }) {
    var _a;
    const body = Buffer.from(contents);
    const ETag = etag_1.default(body, { weak: true });
    const headers = {
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType || 'application/octet-stream',
        ETag,
        Vary: 'Accept-Encoding',
    };
    if (req.headers['if-none-match'] === ETag) {
        res.writeHead(304, headers);
        res.end();
        return;
    }
    let acceptEncoding = req.headers['accept-encoding'] || '';
    if (((_a = req.headers['cache-control']) === null || _a === void 0 ? void 0 : _a.includes('no-transform')) ||
        ['HEAD', 'OPTIONS'].includes(req.method) ||
        !contentType ||
        !compressible_1.default(contentType)) {
        acceptEncoding = '';
    }
    // Handle gzip compression
    if (/\bgzip\b/.test(acceptEncoding) && stream_1.default.Readable.from) {
        const bodyStream = stream_1.default.Readable.from([body]);
        headers['Content-Encoding'] = 'gzip';
        res.writeHead(200, headers);
        stream_1.default.pipeline(bodyStream, zlib_1.default.createGzip(), res, function onError(err) {
            if (err) {
                res.end();
                logger_1.logger.error(`✘ An error occurred serving ${colors.bold(req.url)}`);
                logger_1.logger.error(typeof err !== 'string' ? err.toString() : err);
            }
        });
        return;
    }
    // Handle partial requests
    // TODO: This throws out a lot of hard work, and ignores any build. Improve.
    const { range } = req.headers;
    if (range) {
        if (!originalFileLoc) {
            throw new Error('Virtual files do not support partial requests');
        }
        const { size: fileSize } = fs_1.statSync(originalFileLoc);
        const [rangeStart, rangeEnd] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(rangeStart, 10);
        const end = rangeEnd ? parseInt(rangeEnd, 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const fileStream = fs_1.createReadStream(originalFileLoc, { start, end });
        res.writeHead(206, {
            ...headers,
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': chunkSize,
        });
        fileStream.pipe(res);
        return;
    }
    res.writeHead(200, headers);
    res.write(body);
    res.end();
}
function sendResponseError(req, res, status) {
    const contentType = mime_types_1.default.contentType(path_1.default.extname(req.url) || '.html');
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType || 'application/octet-stream',
        Vary: 'Accept-Encoding',
    };
    res.writeHead(status, headers);
    res.end();
}
function handleResponseError(req, res, err) {
    var _a;
    if (err instanceof NotFoundError) {
        // Don't log favicon "Not Found" errors. Browsers automatically request a favicon.ico file
        // from the server, which creates annoying errors for new apps / first experiences.
        if (req.url !== '/favicon.ico') {
            logger_1.logger.error(`[404] ${err.message}`);
        }
        sendResponseError(req, res, 404);
        return;
    }
    console.log(err);
    logger_1.logger.error(err.toString());
    logger_1.logger.error(`[500] ${req.url}`, {
        // @ts-ignore
        name: (_a = err.__snowpackBuildDetails) === null || _a === void 0 ? void 0 : _a.name,
    });
    sendResponseError(req, res, 500);
    return;
}
function getServerRuntime(sp, config, options = {}) {
    const runtime = ssr_loader_1.createLoader({
        config,
        load: async (url) => {
            const result = await sp.loadUrl(url, { isSSR: true, allowStale: false, encoding: 'utf8' });
            if (!result)
                throw new NotFoundError(url);
            return result;
        },
    });
    if (options.invalidateOnChange !== false) {
        sp.onFileChange(({ filePath }) => {
            const url = sp.getUrlForFile(filePath);
            if (url) {
                runtime.invalidateModule(url);
            }
        });
    }
    return runtime;
}
async function startServer(commandOptions, { isDev: _isDev, isWatch: _isWatch, preparePackages: _preparePackages, } = {}) {
    const { config } = commandOptions;
    const isDev = _isDev !== null && _isDev !== void 0 ? _isDev : config.mode !== 'production';
    const isWatch = _isWatch !== null && _isWatch !== void 0 ? _isWatch : true;
    const isPreparePackages = _preparePackages !== null && _preparePackages !== void 0 ? _preparePackages : true;
    const pkgSource = util_1.getPackageSource(config);
    if (isPreparePackages) {
        await pkgSource.prepare();
        logger_1.logger.info(colors.bold('Ready!'));
    }
    let serverStart = perf_hooks_1.performance.now();
    const { port: defaultPort, hostname, open, openUrl } = config.devOptions;
    const messageBus = new events_1.EventEmitter();
    const PACKAGE_PATH_PREFIX = path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg/');
    const PACKAGE_LINK_PATH_PREFIX = path_1.default.posix.join(config.buildOptions.metaUrlPath, 'link/');
    let port;
    let warnedDeprecatedPackageImport = new Set();
    if (defaultPort !== 0) {
        port = await paint_1.getPort(defaultPort);
        // Reset the clock if we had to wait for the user prompt to select a new port.
        if (port !== defaultPort) {
            serverStart = perf_hooks_1.performance.now();
        }
    }
    // Fill in any command-specific plugin methods.
    for (const p of config.plugins) {
        p.markChanged = (fileLoc) => {
            knownETags.clear();
            onWatchEvent(fileLoc);
        };
    }
    if (isWatch && config.devOptions.output === 'dashboard' && process.stdout.isTTY) {
        paint_1.startDashboard(messageBus, config);
    }
    else {
        // "stream": Log relevent events to the console.
        messageBus.on(paint_1.paintEvent.WORKER_MSG, ({ id, msg }) => {
            logger_1.logger.info(msg.trim(), { name: id });
        });
    }
    const symlinkDirectories = new Map();
    const inMemoryBuildCache = new Map();
    let fileToUrlMapping = new OneToManyMap();
    const excludeGlobs = [
        ...config.exclude,
        ...(config.mode === 'test' ? [] : config.testOptions.files),
    ];
    const foundExcludeMatch = picomatch_1.default(excludeGlobs, { ignore: '**/node_modules/**' });
    for (const [mountKey, mountEntry] of Object.entries(config.mount)) {
        logger_1.logger.debug(`Mounting directory: '${mountKey}' as URL '${mountEntry.url}'`);
        const files = (await new fdir_1.fdir()
            .withFullPaths()
            // Note: exclude() only matches directories, and not files. However, the cost
            // of false positives here is minor, so do this as a quick check to possibly
            // skip scanning into entire folder trees.
            .exclude((_, dirPath) => foundExcludeMatch(dirPath))
            .crawl(mountKey)
            .withPromise());
        for (const f of files) {
            fileToUrlMapping.add(f, file_urls_1.getUrlsForFile(f, config));
        }
    }
    logger_1.logger.debug(`Using in-memory cache: ${fileToUrlMapping}`);
    const readCredentials = async (cwd) => {
        const secure = config.devOptions.secure;
        let cert;
        let key;
        if (typeof secure === 'object') {
            cert = secure.cert;
            key = secure.key;
        }
        else {
            const certPath = path_1.default.join(cwd, 'snowpack.crt');
            const keyPath = path_1.default.join(cwd, 'snowpack.key');
            [cert, key] = await Promise.all([fs_1.promises.readFile(certPath), fs_1.promises.readFile(keyPath)]);
        }
        return {
            cert,
            key,
        };
    };
    let credentials;
    if (config.devOptions.secure) {
        try {
            logger_1.logger.debug(`reading credentials`);
            credentials = await readCredentials(config.root);
        }
        catch (e) {
            logger_1.logger.error(`✘ No HTTPS credentials found!`);
            logger_1.logger.info(`You can specify HTTPS credentials via either:

  - Including credentials in your project config under ${colors.yellow(`devOptions.secure`)}.
  - Including ${colors.yellow('snowpack.crt')} and ${colors.yellow('snowpack.key')} files in your project's root directory.

    You can automatically generate credentials for your project via either:

  - ${colors.cyan('devcert')}: ${colors.yellow('npx devcert-cli generate localhost')}
    https://github.com/davewasmer/devcert-cli (no install required)

  - ${colors.cyan('mkcert')}: ${colors.yellow('mkcert -install && mkcert -key-file snowpack.key -cert-file snowpack.crt localhost')}
    https://github.com/FiloSottile/mkcert (install required)`);
            process.exit(1);
        }
    }
    for (const runPlugin of config.plugins) {
        if (runPlugin.run) {
            logger_1.logger.debug(`starting ${runPlugin.name} run() workers`);
            runPlugin
                .run({
                isDev,
                // @ts-ignore: internal API only
                log: (msg, data) => {
                    if (msg === 'CONSOLE_INFO') {
                        logger_1.logger.info(data.msg, { name: runPlugin.name });
                    }
                    else {
                        messageBus.emit(msg, { ...data, id: runPlugin.name });
                    }
                },
            })
                .then(() => {
                logger_1.logger.info('Command completed.', { name: runPlugin.name });
            })
                .catch((err) => {
                logger_1.logger.error(`Command exited with error code: ${err}`, { name: runPlugin.name });
                process.exit(1);
            });
        }
    }
    function getOutputExtensionMatch() {
        let outputExts = [];
        for (const plugin of config.plugins) {
            if (plugin.resolve) {
                for (const outputExt of plugin.resolve.output) {
                    const ext = outputExt.toLowerCase();
                    if (!outputExts.includes(ext)) {
                        outputExts.push(ext);
                    }
                }
            }
        }
        outputExts = outputExts.sort((a, b) => b.split('.').length - a.split('.').length);
        return (base) => {
            const basename = base.toLowerCase();
            for (const ext of outputExts) {
                if (basename.endsWith(ext))
                    return ext;
            }
            return path_1.default.extname(basename);
        };
    }
    const matchOutputExt = getOutputExtensionMatch();
    async function loadUrl(reqUrl, { isSSR: _isSSR, isHMR: _isHMR, isResolve: _isResolve, encoding: _encoding, importMap, } = {}) {
        const isSSR = _isSSR !== null && _isSSR !== void 0 ? _isSSR : false;
        //   // Default to HMR on, but disable HMR if SSR mode is enabled.
        const isHMR = _isHMR !== null && _isHMR !== void 0 ? _isHMR : (!!config.devOptions.hmr && !isSSR);
        const encoding = _encoding !== null && _encoding !== void 0 ? _encoding : null;
        const reqUrlHmrParam = reqUrl.includes('?mtime=') && reqUrl.split('?')[1];
        let reqPath = decodeURI(url_1.default.parse(reqUrl).pathname);
        if (reqPath === build_import_proxy_1.getMetaUrlPath('/hmr-client.js', config)) {
            return {
                contents: encodeResponse(util_2.HMR_CLIENT_CODE, encoding),
                imports: [],
                originalFileLoc: null,
                contentType: 'application/javascript',
            };
        }
        if (reqPath === build_import_proxy_1.getMetaUrlPath('/hmr-error-overlay.js', config)) {
            return {
                contents: encodeResponse(util_2.HMR_OVERLAY_CODE, encoding),
                imports: [],
                originalFileLoc: null,
                contentType: 'application/javascript',
            };
        }
        if (reqPath === build_import_proxy_1.getMetaUrlPath('/env.js', config)) {
            return {
                contents: encodeResponse(build_import_proxy_1.generateEnvModule({
                    mode: config.mode,
                    isSSR,
                    configEnv: config.env,
                }), encoding),
                imports: [],
                originalFileLoc: null,
                contentType: 'application/javascript',
            };
        }
        // * NPM Packages:
        // NPM packages are served via `/_snowpack/pkg/` URLs. Behavior varies based on package source (local, remote)
        // but as a general rule all URLs contained within are managed by the package source loader. When this URL
        // prefix is hit, we load the file through the selected package source loader.
        if (reqPath.startsWith(PACKAGE_PATH_PREFIX)) {
            // Backwards-compatable redirect for legacy package URLs: If someone has created an import URL manually
            // (ex: /_snowpack/pkg/react.js) then we need to redirect and warn to use our new API in the future.
            if (reqUrl.split('.').length <= 2 && config.packageOptions.source !== 'remote') {
                if (!warnedDeprecatedPackageImport.has(reqUrl)) {
                    logger_1.logger.warn(`(${reqUrl}) Deprecated manual package import. Please use snowpack.getUrlForPackage() to create package URLs instead.`);
                    warnedDeprecatedPackageImport.add(reqUrl);
                }
                const redirectUrl = await pkgSource.resolvePackageImport(reqUrl.replace(PACKAGE_PATH_PREFIX, '').replace(/\.js/, ''));
                reqPath = decodeURI(url_1.default.parse(redirectUrl).pathname);
            }
            const resourcePath = reqPath.replace(/\.map$/, '').replace(/\.proxy\.js$/, '');
            const webModuleUrl = resourcePath.substr(PACKAGE_PATH_PREFIX.length);
            let loadedModule = await pkgSource.load(webModuleUrl, { isSSR });
            if (!loadedModule) {
                throw new NotFoundError(reqPath);
            }
            if (reqPath.endsWith('.proxy.js')) {
                return {
                    imports: [],
                    contents: await build_import_proxy_1.wrapImportProxy({
                        url: resourcePath,
                        code: loadedModule.contents,
                        hmr: isHMR,
                        config: config,
                    }),
                    originalFileLoc: null,
                    contentType: 'application/javascript',
                };
            }
            return {
                imports: loadedModule.imports,
                contents: encodeResponse(loadedModule.contents, encoding),
                originalFileLoc: null,
                contentType: mime_types_1.default.lookup(reqPath) || 'application/javascript',
            };
        }
        // Most of the time, resourcePath should have ".map" and ".proxy.js" extensions stripped to
        // match the file on disk. However, sometimes the on disk is an actual source map in a static
        // directory, so we can't strip that info just yet. Try the exact match first, and then strip
        // it later on if there is no match.
        let resourcePath = reqPath;
        let resourceType = matchOutputExt(reqPath);
        if (util_2.IS_DOTFILE_REGEX.test(reqPath))
            resourceType = '';
        let foundFile;
        // * Workspaces & Linked Packages:
        // The "local" package resolver supports npm packages that live in a local directory,
        // usually a part of your monorepo/workspace. Snowpack treats these files as source files,
        // with each file served individually and rebuilt instantly when changed. In the future,
        // these linked packages may be bundled again with a rapid bundler like esbuild.
        if (config.workspaceRoot && reqPath.startsWith(PACKAGE_LINK_PATH_PREFIX)) {
            const symlinkResourceUrl = reqPath.substr(PACKAGE_LINK_PATH_PREFIX.length);
            const symlinkResourceLoc = path_1.default.resolve(config.workspaceRoot, process.platform === 'win32' ? symlinkResourceUrl.replace(/\//g, '\\') : symlinkResourceUrl);
            const symlinkResourceDirectory = path_1.default.dirname(symlinkResourceLoc);
            const fileStat = await fs_1.promises.stat(symlinkResourceDirectory).catch(() => null);
            if (!fileStat) {
                throw new NotFoundError(reqPath, [symlinkResourceDirectory]);
            }
            // If this is the first file served out of this linked directory
            // - add it to our file watcher (to enable HMR)
            // - add it to our file<>URL mapping for future lookups
            // - add a promise to our directory<>promise map, which acts as
            //   a guard to ensure no loadUrls for this directory proceed before
            //   proccessing of this directory is done
            // Each directory is scanned shallowly, so nested directories inside
            // of `symlinkDirectories` are okay.
            if (!symlinkDirectories.get(symlinkResourceDirectory)) {
                logger_1.logger.debug(`Mounting symlink directory: '${symlinkResourceDirectory}' as URL '${path_1.default.dirname(reqPath)}'`);
                symlinkDirectories.set(symlinkResourceDirectory, processDirectory());
                watcher && watcher.add(symlinkResourceDirectory);
                async function processDirectory() {
                    const shallowFiles = (await new fdir_1.fdir()
                        .withFullPaths()
                        .withMaxDepth(0)
                        .crawl(symlinkResourceDirectory)
                        .withPromise());
                    for (const f of shallowFiles) {
                        if (fileToUrlMapping.value(f)) {
                            logger_1.logger.warn(`Warning: mounted file is being imported as a package.\n` +
                                `Workspace & monorepo packages work automatically and do not need to be mounted.`);
                        }
                        else {
                            fileToUrlMapping.add(f, file_urls_1.getBuiltFileUrls(f, config).map((u) => {
                                const url = path_1.default.posix.join(config.buildOptions.metaUrlPath, 'link', slash_1.default(path_1.default.relative(config.workspaceRoot, u)));
                                return url;
                            }));
                        }
                    }
                }
            }
            // guard: ensure directory is properly read and files registered before proceeding
            await symlinkDirectories.get(symlinkResourceDirectory);
            let attemptedFileLoc = fileToUrlMapping.key(reqPath);
            if (!attemptedFileLoc) {
                resourcePath = reqPath.replace(/\.map$/, '').replace(/\.proxy\.js$/, '');
                resourceType = path_1.default.extname(resourcePath);
            }
            attemptedFileLoc = fileToUrlMapping.key(resourcePath);
            if (!attemptedFileLoc) {
                throw new NotFoundError(reqPath);
            }
            const fileLocationExists = await fs_1.promises.stat(attemptedFileLoc).catch(() => null);
            if (!fileLocationExists) {
                throw new NotFoundError(reqPath, [attemptedFileLoc]);
            }
            let foundType = path_1.default.extname(reqPath);
            if (!foundType && attemptedFileLoc.endsWith('.html'))
                foundType = '.html';
            if (util_2.IS_DOTFILE_REGEX.test(reqPath))
                foundType = '';
            foundFile = {
                loc: attemptedFileLoc,
                type: foundType,
                isStatic: false,
                isResolve: true,
            };
        }
        // * Local Files
        // If this is not a special URL route, then treat it as a normal file request.
        // Check our file<>URL mapping for the most relevant match, and continue if found.
        // Otherwise, return a 404.
        else {
            let attemptedFileLoc = fileToUrlMapping.key(resourcePath);
            if (!attemptedFileLoc) {
                resourcePath = reqPath.replace(/\.map$/, '').replace(/\.proxy\.js$/, '');
                if (resourcePath.endsWith('/')) {
                    resourcePath += 'index.html'; // if trailing slash, pretending like /index.html was requested makes the below much easier
                }
                resourceType = path_1.default.extname(resourcePath);
            }
            attemptedFileLoc =
                fileToUrlMapping.key(resourcePath) ||
                    fileToUrlMapping.key(resourcePath + '.html') ||
                    fileToUrlMapping.key(resourcePath + '/index.html');
            if (!attemptedFileLoc) {
                // last attempt: if this is a CSS Module, try and load JSON
                if (resourcePath.endsWith('.module.css.json')) {
                    const srcLoc = resourcePath.replace(/\.json$/i, '');
                    return {
                        imports: [],
                        contents: import_css_1.cssModuleJSON(srcLoc),
                        originalFileLoc: srcLoc,
                        contentType: mime_types_1.default.lookup('.json'),
                    };
                }
                throw new NotFoundError(reqPath);
            }
            const [, mountEntry] = file_urls_1.getMountEntryForFile(attemptedFileLoc, config);
            // TODO: This data type structuring/destructuring is neccesary for now,
            // but we hope to add "virtual file" support soon via plugins. This would
            // be the interface for those response types.
            let foundType = path_1.default.extname(reqPath);
            if (!foundType && attemptedFileLoc.endsWith('.html'))
                foundType = '.html';
            if (util_2.IS_DOTFILE_REGEX.test(reqPath))
                foundType = '';
            foundFile = {
                loc: attemptedFileLoc,
                type: foundType,
                isStatic: mountEntry.static,
                isResolve: mountEntry.resolve,
            };
        }
        const { loc: fileLoc, type: responseType } = foundFile;
        // TODO: Once plugins are able to add virtual files + imports, this will no longer be needed.
        // - isStatic Workaround: HMR plugins need to add scripts to HTML file, even if static.
        const isStatic = foundFile.isStatic && responseType !== '.html';
        const isResolve = _isResolve !== null && _isResolve !== void 0 ? _isResolve : true;
        // 1. Check the hot build cache. If it's already found, then just serve it.
        const cacheKey = util_2.getCacheKey(fileLoc, { isSSR, mode: config.mode });
        let fileBuilder = inMemoryBuildCache.get(cacheKey);
        if (!fileBuilder) {
            fileBuilder = new file_builder_1.FileBuilder({
                loc: fileLoc,
                isDev,
                isSSR,
                isHMR,
                config,
                hmrEngine,
            });
            // note: for Tailwind, CSS needs to avoid caching in dev server (Tailwind needs to handle rebuilding, not Snowpack)
            const isTailwind = config.devOptions.tailwindConfig && (fileLoc.endsWith('.css') || fileLoc.endsWith('.pcss'));
            if (!isTailwind) {
                inMemoryBuildCache.set(cacheKey, fileBuilder);
            }
        }
        function handleFinalizeError(err) {
            logger_1.logger.error(FILE_BUILD_RESULT_ERROR);
            hmrEngine &&
                hmrEngine.broadcastMessage({
                    type: 'error',
                    title: FILE_BUILD_RESULT_ERROR,
                    errorMessage: err.toString(),
                    fileLoc,
                    errorStackTrace: err.stack,
                });
        }
        let finalizedResponse;
        let resolvedImports = [];
        try {
            if (Object.keys(fileBuilder.buildOutput).length === 0) {
                await fileBuilder.build(isStatic);
            }
            if (resourcePath !== reqPath && reqPath.endsWith('.proxy.js')) {
                finalizedResponse = await fileBuilder.getProxy(resourcePath, resourceType);
                // CSS Modules only: also generate JSON module mapping (not imported so must be added manually)
                if (reqPath.endsWith('.module.css.proxy.js') && fileBuilder.buildOutput['.json']) {
                    resolvedImports.push(util_2.createInstallTarget(`${resourcePath}.json`));
                }
            }
            else if (resourcePath !== reqPath && reqPath.endsWith('.map')) {
                finalizedResponse = fileBuilder.getSourceMap(resourcePath);
            }
            else {
                if (foundFile.isResolve) {
                    // TODO: Warn if reqUrlHmrParam was needed here? HMR can't work if URLs aren't resolved.
                    resolvedImports = await fileBuilder.resolveImports(isResolve, reqUrlHmrParam, importMap);
                }
                finalizedResponse = fileBuilder.getResult(resourceType);
            }
        }
        catch (err) {
            handleFinalizeError(err);
            throw err;
        }
        if (finalizedResponse) {
            return {
                imports: resolvedImports,
                contents: encodeResponse(finalizedResponse, encoding),
                originalFileLoc: fileLoc,
                contentType: mime_types_1.default.lookup(responseType),
            };
        }
    }
    /**
     * A simple map to optimize the speed of our 304 responses. If an ETag check is
     * sent in the request, check if it matches the last known etag for tat file.
     *
     * Remember: This is just a nice-to-have! If we get this logic wrong, it can mean
     * stale files in the user's cache. Feel free to clear aggressively, as needed.
     */
    const knownETags = new Map();
    function matchRouteHandler(reqUrl, expectHandler) {
        if (reqUrl.startsWith(config.buildOptions.metaUrlPath)) {
            return null;
        }
        const reqPath = decodeURI(url_1.default.parse(reqUrl).pathname);
        const reqExt = matchOutputExt(reqPath);
        const isRoute = !reqExt || reqExt.toLowerCase() === '.html';
        for (const route of config.routes) {
            if (route.match === 'routes' && !isRoute) {
                continue;
            }
            if (!route[expectHandler]) {
                continue;
            }
            if (route._srcRegex.test(reqPath)) {
                return route[expectHandler];
            }
        }
        return null;
    }
    /**
     * Fully handle the response for a given request. This is used internally for
     * every response that the dev server sends, but it can also be used via the
     * JS API to handle most boilerplate around request handling.
     */
    async function handleRequest(req, res, { handleError } = {}) {
        let reqUrl = req.url;
        const matchedRouteHandler = matchRouteHandler(reqUrl, 'dest');
        // If a route is matched, rewrite the URL or call the route function
        if (matchedRouteHandler) {
            if (typeof matchedRouteHandler === 'string') {
                reqUrl = matchedRouteHandler;
            }
            else {
                return matchedRouteHandler(req, res);
            }
        }
        // Check if we can send back an optimized 304 response
        const quickETagCheck = req.headers['if-none-match'];
        const quickETagCheckUrl = reqUrl.replace(/\/$/, '/index.html');
        if (quickETagCheck && quickETagCheck === knownETags.get(quickETagCheckUrl)) {
            logger_1.logger.debug(`optimized etag! sending 304...`);
            res.writeHead(304, { 'Access-Control-Allow-Origin': '*' });
            res.end();
            return;
        }
        // Backwards-compatable redirect for legacy package URLs: If someone has created an import URL manually
        // (ex: /_snowpack/pkg/react.js) then we need to redirect and warn to use our new API in the future.
        if (reqUrl.startsWith(PACKAGE_PATH_PREFIX) &&
            reqUrl.split('.').length <= 2 &&
            config.packageOptions.source !== 'remote') {
            if (!warnedDeprecatedPackageImport.has(reqUrl)) {
                logger_1.logger.warn(`(${reqUrl}) Deprecated manual package import. Please use snowpack.getUrlForPackage() to create package URLs instead.`);
                warnedDeprecatedPackageImport.add(reqUrl);
            }
            const redirectUrl = await pkgSource.resolvePackageImport(reqUrl.replace(PACKAGE_PATH_PREFIX, '').replace(/\.js/, ''));
            res.writeHead(301, { Location: redirectUrl });
            res.end();
            return;
        }
        // Otherwise, load the file and respond if successful.
        try {
            const result = await loadUrl(reqUrl, { allowStale: true, encoding: null });
            if (!result) {
                throw new NotFoundError(reqUrl);
            }
            sendResponseFile(req, res, result);
            if (result.checkStale) {
                await result.checkStale();
            }
            if (result.contents) {
                const tag = etag_1.default(result.contents, { weak: true });
                const reqPath = decodeURI(url_1.default.parse(reqUrl).pathname);
                knownETags.set(reqPath, tag);
            }
            return;
        }
        catch (err) {
            // Some consumers may want to handle/ignore errors themselves.
            if (handleError === false) {
                throw err;
            }
            handleResponseError(req, res, err);
        }
    }
    async function handleUpgrade(req, socket, head) {
        let reqUrl = req.url;
        const matchedRouteHandler = matchRouteHandler(reqUrl, 'upgrade');
        if (matchedRouteHandler) {
            matchedRouteHandler(req, socket, head);
        }
    }
    const createServer = (responseHandler) => {
        if (credentials) {
            return http2_1.default.createSecureServer({ ...credentials, allowHTTP1: true }, responseHandler);
        }
        return http_1.default.createServer(responseHandler);
    };
    let server;
    if (port) {
        server = createServer(async (req, res) => {
            // Attach a request logger.
            res.on('finish', () => {
                const { method, url } = req;
                const { statusCode } = res;
                logger_1.logger.debug(`[${statusCode}] ${method} ${url}`);
            });
            // Otherwise, pass requests directly to Snowpack's request handler.
            handleRequest(req, res);
        })
            .on('upgrade', (req, socket, head) => {
            handleUpgrade(req, socket, head);
        })
            .on('error', (err) => {
            logger_1.logger.error(colors.red(`  ✘ Failed to start server at port ${colors.bold(port)}.`), err);
            server.close();
            process.exit(1);
        })
            .listen(port);
        // Announce server has started
        const remoteIps = Object.values(os_1.default.networkInterfaces())
            .reduce((every, i) => [...every, ...(i || [])], [])
            .filter((i) => i.family === 'IPv4' && i.internal === false)
            .map((i) => i.address);
        const protocol = config.devOptions.secure ? 'https:' : 'http:';
        // Log the successful server start.
        const startTimeMs = Math.round(perf_hooks_1.performance.now() - serverStart);
        logger_1.logger.info(colors.green(`Server started in ${startTimeMs}ms.`));
        logger_1.logger.info(`${colors.green('Local:')} ${`${protocol}//${hostname}:${port}`}`);
        if (remoteIps.length > 0) {
            logger_1.logger.info(`${colors.green('Network:')} ${`${protocol}//${remoteIps[0]}:${port}`}`);
        }
    }
    // HMR Engine
    const { hmrEngine, handleHmrUpdate } = config.devOptions.hmr
        ? hmr_1.startHmrEngine(inMemoryBuildCache, server, port, config)
        : { hmrEngine: undefined, handleHmrUpdate: undefined };
    // Allow the user to hook into this callback, if they like (noop by default)
    let onFileChangeCallbacks = [];
    let watcher;
    // Watch src files
    async function onWatchEvent(fileLoc) {
        logger_1.logger.info(colors.cyan('File changed: ') + path_1.default.relative(config.workspaceRoot || config.root, fileLoc));
        const updatedUrls = file_urls_1.getUrlsForFile(fileLoc, config);
        if (updatedUrls) {
            handleHmrUpdate && handleHmrUpdate(fileLoc, updatedUrls[0]);
            knownETags.delete(updatedUrls[0]);
            knownETags.delete(updatedUrls[0] + '.proxy.js');
        }
        inMemoryBuildCache.delete(util_2.getCacheKey(fileLoc, { isSSR: true, mode: config.mode }));
        inMemoryBuildCache.delete(util_2.getCacheKey(fileLoc, { isSSR: false, mode: config.mode }));
        await Promise.all(onFileChangeCallbacks.map((callback) => callback({ filePath: fileLoc })));
        for (const plugin of config.plugins) {
            plugin.onChange && plugin.onChange({ filePath: fileLoc });
        }
    }
    if (isWatch) {
        // Start watching the file system.
        // Defer "chokidar" loading to here, to reduce impact on overall startup time
        const chokidar = await Promise.resolve().then(() => __importStar(require('chokidar')));
        watcher = chokidar.watch([], {
            ignored: config.exclude.filter((k) => k !== '**/_*.{sass,scss}'),
            persistent: true,
            ignoreInitial: true,
            disableGlobbing: false,
            useFsEvents: util_2.isFsEventsEnabled(),
        });
        watcher.on('add', async (fileLoc) => {
            knownETags.clear();
            await pkgSource.prepareSingleFile(fileLoc);
            await onWatchEvent(fileLoc);
            fileToUrlMapping.add(fileLoc, file_urls_1.getUrlsForFile(fileLoc, config));
        });
        watcher.on('unlink', async (fileLoc) => {
            knownETags.clear();
            await onWatchEvent(fileLoc);
            fileToUrlMapping.delete(fileLoc);
        });
        watcher.on('change', async (fileLoc) => {
            // TODO: If this needs to build a new dependency, report to the browser via HMR event.
            await pkgSource.prepareSingleFile(fileLoc);
            await onWatchEvent(fileLoc);
        });
        // [hmrDelay] - Let users with noisy startups delay HMR (ex: 11ty, tsc builds)
        setTimeout(() => {
            watcher.add(Object.keys(config.mount));
            if (config.devOptions.output !== 'dashboard' || !process.stdout.isTTY) {
                logger_1.logger.info(colors.cyan('watching for file changes... '));
            }
        }, config.devOptions.hmrDelay);
    }
    // Open the user's browser (ignore if failed)
    if (server && port && open && open !== 'none') {
        const protocol = config.devOptions.secure ? 'https:' : 'http:';
        await util_2.openInBrowser(protocol, hostname, port, open, openUrl).catch((err) => {
            logger_1.logger.debug(`Browser open error: ${err}`);
        });
    }
    const sp = {
        port: port || defaultPort,
        hmrEngine,
        rawServer: server,
        loadUrl,
        handleRequest,
        sendResponseFile,
        sendResponseError,
        getUrlForPackage: (pkgSpec) => {
            return pkgSource.resolvePackageImport(pkgSpec);
        },
        getUrlForFile: (fileLoc) => {
            const result = file_urls_1.getUrlsForFile(fileLoc, config);
            return result ? result[0] : null;
        },
        onFileChange: (callback) => onFileChangeCallbacks.push(callback),
        getServerRuntime: (options) => getServerRuntime(sp, config, options),
        async shutdown() {
            watcher && (await watcher.close());
            await build_pipeline_1.runPipelineCleanupStep(config);
            server && server.close();
            hmrEngine && (await hmrEngine.stop());
        },
        markChanged(fileLoc) {
            knownETags.clear();
            onWatchEvent(fileLoc);
        },
    };
    return sp;
}
exports.startServer = startServer;
async function command(commandOptions) {
    try {
        // Set some CLI-focused defaults
        commandOptions.config.devOptions.output =
            commandOptions.config.devOptions.output || 'dashboard';
        commandOptions.config.devOptions.open = commandOptions.config.devOptions.open || 'default';
        commandOptions.config.devOptions.hmr = commandOptions.config.devOptions.hmr !== false;
        // Start the server
        await startServer(commandOptions, { isWatch: true });
    }
    catch (err) {
        logger_1.logger.error(err.message);
        logger_1.logger.debug(err.stack);
        process.exit(1);
    }
    return new Promise(() => { });
}
exports.command = command;
