"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileBuilder = void 0;
const fs_1 = require("fs");
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const rewrite_imports_1 = require("../rewrite-imports");
const scan_imports_1 = require("../scan-imports");
const util_1 = require("../sources/util");
const util_2 = require("../util");
const build_import_proxy_1 = require("./build-import-proxy");
const build_pipeline_1 = require("./build-pipeline");
const file_urls_1 = require("./file-urls");
const import_resolver_1 = require("./import-resolver");
/**
 * FileBuilder - This class is responsible for building a file. It is broken into
 * individual stages so that the entire application build process can be tackled
 * in stages (build -> resolve -> get response).
 */
class FileBuilder {
    constructor({ loc, isDev, isHMR, isSSR, config, hmrEngine, }) {
        this.buildOutput = {};
        this.resolvedOutput = {};
        this.hmrEngine = null;
        this.loc = loc;
        this.isDev = isDev;
        this.isHMR = isHMR;
        this.isSSR = isSSR;
        this.config = config;
        this.hmrEngine = hmrEngine || null;
        const urls = file_urls_1.getUrlsForFile(loc, config);
        if (!urls) {
            throw new Error(`No mounted URLs configured for file: ${loc}`);
        }
        this.urls = urls;
    }
    verifyRequestFromBuild(type) {
        const possibleExtensions = this.urls.map((url) => path_1.default.extname(url));
        if (!possibleExtensions.includes(type))
            throw new Error(`${this.loc} - Requested content "${type}" but only built ${possibleExtensions.join(', ')}`);
        return this.resolvedOutput[type];
    }
    /**
     * Resolve Imports: Resolved imports are based on the state of the file
     * system, so they can't be cached long-term with the build.
     */
    async resolveImports(isResolve, hmrParam, importMap) {
        var _a;
        const urlPathDirectory = path_1.default.posix.dirname(this.urls[0]);
        const pkgSource = util_1.getPackageSource(this.config);
        const resolvedImports = [];
        for (const [type, outputResult] of Object.entries(this.buildOutput)) {
            if (!(type === '.js' || type === '.html' || type === '.css')) {
                continue;
            }
            let contents = typeof outputResult.code === 'string'
                ? outputResult.code
                : outputResult.code.toString('utf8');
            // Handle attached CSS.
            if (type === '.js' && this.buildOutput['.css']) {
                const relativeCssImport = `./${util_2.replaceExtension(path_1.default.posix.basename(this.urls[0]), '.js', '.css')}`;
                contents = `import '${relativeCssImport}';\n` + contents;
            }
            // Finalize the response
            contents = this.finalizeResult(type, contents);
            //
            const resolveImportGlobSpecifier = import_resolver_1.createImportGlobResolver({
                fileLoc: this.loc,
                config: this.config,
            });
            // resolve all imports
            const resolveImportSpecifier = import_resolver_1.createImportResolver({
                fileLoc: this.loc,
                config: this.config,
            });
            const resolveImport = async (spec) => {
                var _a;
                // Ignore packages marked as external
                if ((_a = this.config.packageOptions.external) === null || _a === void 0 ? void 0 : _a.includes(spec)) {
                    return spec;
                }
                if (util_2.isRemoteUrl(spec)) {
                    return spec;
                }
                // Try to resolve the specifier to a known URL in the project
                let resolvedImportUrl = resolveImportSpecifier(spec);
                // Handle a package import
                if (!resolvedImportUrl) {
                    try {
                        return await pkgSource.resolvePackageImport(spec, {
                            importMap: importMap || (isResolve ? undefined : { imports: {} }),
                        });
                    }
                    catch (err) {
                        if (!isResolve && /not included in import map./.test(err.message)) {
                            return spec;
                        }
                        throw err;
                    }
                }
                return resolvedImportUrl || spec;
            };
            const scannedImports = await scan_imports_1.scanImportsFromFiles([
                {
                    baseExt: type,
                    root: this.config.root,
                    locOnDisk: this.loc,
                    contents,
                },
            ], this.config);
            contents = await build_import_proxy_1.transformGlobImports({ contents, resolveImportGlobSpecifier });
            contents = await rewrite_imports_1.transformFileImports({ type, contents }, async (spec) => {
                let resolvedImportUrl = await resolveImport(spec);
                // Handle normal "./" & "../" import specifiers
                const importExtName = path_1.default.posix.extname(resolvedImportUrl);
                const isProxyImport = importExtName && importExtName !== '.js' && importExtName !== '.mjs';
                const isAbsoluteUrlPath = path_1.default.posix.isAbsolute(resolvedImportUrl);
                if (isAbsoluteUrlPath) {
                    if (isResolve && this.config.buildOptions.resolveProxyImports && isProxyImport) {
                        resolvedImportUrl = resolvedImportUrl + '.proxy.js';
                    }
                    resolvedImports.push(util_2.createInstallTarget(resolvedImportUrl));
                }
                else {
                    resolvedImports.push(...scannedImports
                        .filter(({ specifier }) => specifier === spec)
                        .map((installTarget) => {
                        installTarget.specifier = resolvedImportUrl;
                        return installTarget;
                    }));
                }
                if (isAbsoluteUrlPath) {
                    // When dealing with an absolute import path, we need to honor the baseUrl
                    // proxy modules may attach code to the root HTML (like style) so don't resolve
                    resolvedImportUrl = util_2.relativeURL(urlPathDirectory, resolvedImportUrl);
                }
                return resolvedImportUrl;
            });
            // This is a hack since we can't currently scan "script" `src=` tags as imports.
            // Either move these to inline JavaScript in the script body, or add support for
            // `script.src=` and `link.href` scanning & resolving in transformFileImports().
            if (type === '.html' && this.isHMR) {
                if (contents.includes(build_import_proxy_1.SRI_CLIENT_HMR_SNOWPACK)) {
                    resolvedImports.push(util_2.createInstallTarget(build_import_proxy_1.getMetaUrlPath('hmr-client.js', this.config)));
                }
                if (contents.includes(build_import_proxy_1.SRI_ERROR_HMR_SNOWPACK)) {
                    resolvedImports.push(util_2.createInstallTarget(build_import_proxy_1.getMetaUrlPath('hmr-error-overlay.js', this.config)));
                }
            }
            if (type === '.js' && hmrParam) {
                contents = await rewrite_imports_1.transformEsmImports(contents, (imp) => {
                    var _a, _b;
                    const importUrl = path_1.default.posix.resolve(urlPathDirectory, imp);
                    const node = (_a = this.hmrEngine) === null || _a === void 0 ? void 0 : _a.getEntry(importUrl);
                    if (node && node.needsReplacement) {
                        (_b = this.hmrEngine) === null || _b === void 0 ? void 0 : _b.markEntryForReplacement(node, false);
                        return `${imp}?${hmrParam}`;
                    }
                    return imp;
                });
            }
            if (type === '.js') {
                const isHmrEnabled = contents.includes('import.meta.hot');
                const rawImports = await rewrite_imports_1.scanCodeImportsExports(contents);
                const resolvedImports = rawImports.map((imp) => {
                    let spec = contents.substring(imp.s, imp.e).replace(/(\/|\\)+$/, '');
                    if (imp.d > -1) {
                        spec = scan_imports_1.matchDynamicImportValue(spec) || '';
                    }
                    spec = spec.replace(/\?mtime=[0-9]+$/, '');
                    return path_1.default.posix.resolve(urlPathDirectory, spec);
                });
                (_a = this.hmrEngine) === null || _a === void 0 ? void 0 : _a.setEntry(this.urls[0], resolvedImports, isHmrEnabled);
            }
            // Update the output with the new resolved imports
            this.resolvedOutput[type].code = contents;
            this.resolvedOutput[type].map = undefined;
        }
        return resolvedImports;
    }
    /**
     * Given a file, build it. Building a file sends it through our internal
     * file builder pipeline, and outputs a build map representing the final
     * build. A Build Map is used because one source file can result in multiple
     * built files (Example: .svelte -> .js & .css).
     */
    async build(isStatic) {
        if (this.buildPromise) {
            return this.buildPromise;
        }
        const fileBuilderPromise = (async () => {
            if (isStatic) {
                return {
                    [path_1.default.extname(this.loc)]: {
                        code: await fs_1.promises.readFile(this.loc),
                        map: undefined,
                    },
                };
            }
            const builtFileOutput = await build_pipeline_1.buildFile(url_1.default.pathToFileURL(this.loc), {
                config: this.config,
                isDev: this.isDev,
                isSSR: this.isSSR,
                isPackage: false,
                isHmrEnabled: this.isHMR,
            });
            return builtFileOutput;
        })();
        this.buildPromise = fileBuilderPromise;
        try {
            this.resolvedOutput = {};
            this.buildOutput = await fileBuilderPromise;
            for (const [outputKey, { code, map }] of Object.entries(this.buildOutput)) {
                this.resolvedOutput[outputKey] = { code, map };
            }
        }
        finally {
            this.buildPromise = undefined;
        }
    }
    finalizeResult(type, content) {
        // Wrap the response.
        switch (type) {
            case '.html': {
                content = build_import_proxy_1.wrapHtmlResponse({
                    code: content,
                    hmr: this.isHMR,
                    hmrPort: this.hmrEngine ? this.hmrEngine.port : undefined,
                    isDev: this.isDev,
                    config: this.config,
                    mode: this.isDev ? 'development' : 'production',
                });
                break;
            }
            case '.css': {
                break;
            }
            case '.js':
                {
                    content = build_import_proxy_1.wrapImportMeta({
                        code: content,
                        env: true,
                        hmr: this.isHMR,
                        config: this.config,
                    });
                }
                break;
        }
        // Return the finalized response.
        return content;
    }
    getResult(type) {
        const result = this.verifyRequestFromBuild(type);
        if (result) {
            // TODO: return result.map
            return result.code;
        }
    }
    getSourceMap(type) {
        return this.resolvedOutput[type].map;
    }
    async getProxy(_url, type) {
        const code = this.resolvedOutput[type].code;
        const url = this.isDev ? _url : this.config.buildOptions.baseUrl + util_2.removeLeadingSlash(_url);
        return await build_import_proxy_1.wrapImportProxy({ url, code, hmr: this.isHMR, config: this.config });
    }
    async writeToDisk(dir, results) {
        await mkdirp_1.default(path_1.default.dirname(path_1.default.join(dir, this.urls[0])));
        for (const outUrl of this.urls) {
            const buildOutput = results[outUrl].contents;
            const encoding = typeof buildOutput === 'string' ? 'utf8' : undefined;
            await fs_1.promises.writeFile(path_1.default.join(dir, outUrl), buildOutput, encoding);
        }
    }
}
exports.FileBuilder = FileBuilder;
