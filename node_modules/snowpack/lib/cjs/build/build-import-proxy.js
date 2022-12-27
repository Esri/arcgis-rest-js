"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnvModule = exports.wrapImportProxy = exports.transformGlobImports = exports.wrapHtmlResponse = exports.wrapImportMeta = exports.getMetaUrlPath = exports.SRI_ERROR_HMR_SNOWPACK = exports.SRI_CLIENT_HMR_SNOWPACK = void 0;
const path_1 = __importDefault(require("path"));
const logger_1 = require("../logger");
const util_1 = require("../util");
const import_sri_1 = require("./import-sri");
const scan_import_glob_1 = require("../scan-import-glob");
const import_css_1 = require("./import-css");
exports.SRI_CLIENT_HMR_SNOWPACK = import_sri_1.generateSRI(Buffer.from(util_1.HMR_CLIENT_CODE));
exports.SRI_ERROR_HMR_SNOWPACK = import_sri_1.generateSRI(Buffer.from(util_1.HMR_OVERLAY_CODE));
const importMetaRegex = /import\s*\.\s*meta/;
function getMetaUrlPath(urlPath, config) {
    return path_1.default.posix.normalize(path_1.default.posix.join('/', config.buildOptions.metaUrlPath, urlPath));
}
exports.getMetaUrlPath = getMetaUrlPath;
function wrapImportMeta({ code, hmr, env, config, }) {
    // Create Regex expressions here, since global regex has per-string state
    const importMetaHotRegex = /import\s*\.\s*meta\s*\.\s*hot/g;
    const importMetaEnvRegex = /import\s*\.\s*meta\s*\.\s*env/g;
    // Optimize: replace direct references to `import.meta.hot` by inlining undefined.
    // Do this first so that we can bail out in the next `import.meta` test.
    if (!hmr) {
        code = code.replace(importMetaHotRegex, 'undefined /* [snowpack] import.meta.hot */ ');
    }
    if (!importMetaRegex.test(code)) {
        return code;
    }
    let hmrSnippet = ``;
    if (hmr) {
        hmrSnippet = `import * as  __SNOWPACK_HMR__ from '${getMetaUrlPath('hmr-client.js', config)}';\nimport.meta.hot = __SNOWPACK_HMR__.createHotContext(import.meta.url);\n`;
    }
    let envSnippet = ``;
    if (env) {
        envSnippet = `import * as __SNOWPACK_ENV__ from '${getMetaUrlPath('env.js', config)}';\n`;
        // Optimize any direct references `import.meta.env` by inlining the ref
        code = code.replace(importMetaEnvRegex, '__SNOWPACK_ENV__');
        // If we still detect references to `import.meta`, assign `import.meta.env` to be safe
        if (importMetaRegex.test(code)) {
            envSnippet += `import.meta.env = __SNOWPACK_ENV__;\n`;
        }
    }
    return hmrSnippet + envSnippet + '\n' + code;
}
exports.wrapImportMeta = wrapImportMeta;
function wrapHtmlResponse({ code, hmr, hmrPort, isDev, config, mode, }) {
    // replace %PUBLIC_URL% (along with surrounding slashes, if any)
    code = code.replace(/\/?%PUBLIC_URL%\/?/g, isDev ? '/' : config.buildOptions.baseUrl);
    // replace %MODE%
    code = code.replace(/%MODE%/g, mode);
    // replace any %SNOWPACK_PUBLIC_*%
    const snowpackPublicEnv = getSnowpackPublicEnvVariables();
    code = code.replace(/%SNOWPACK_PUBLIC_.+?%/gi, (match) => {
        const envVariableName = match.slice(1, -1);
        if (envVariableName in snowpackPublicEnv) {
            return snowpackPublicEnv[envVariableName] || '';
        }
        logger_1.logger.warn(`Environment variable "${envVariableName}" is not set`);
        return match;
    });
    // replace any env variables defined in the config
    for (const envVar in config.env) {
        const matcher = new RegExp(`%${envVar}%`, 'g');
        const val = config.env[envVar];
        code = code.replace(matcher, val);
    }
    // Full Page Transformations: Only full page responses should get these transformations.
    // Any code not containing `<!DOCTYPE html>` is assumed to be an HTML fragment.
    const isFullPage = code.trim().toLowerCase().startsWith('<!doctype html>');
    if (hmr && !isFullPage && !config.buildOptions.htmlFragments) {
        throw new Error(`HTML fragment found!
HTML fragments (files not starting with "<!doctype html>") are not transformed like full HTML pages.
Add the missing doctype, or set buildOptions.htmlFragments=true if HTML fragments are expected.`);
    }
    if (hmr && isFullPage) {
        let hmrScript = ``;
        if (hmrPort) {
            hmrScript += `<script>window.HMR_WEBSOCKET_PORT=${hmrPort}</script>\n`;
        }
        hmrScript += `<script type="module" integrity="${exports.SRI_CLIENT_HMR_SNOWPACK}" src="${getMetaUrlPath('hmr-client.js', config)}"></script>`;
        if (config.devOptions.hmrErrorOverlay) {
            hmrScript += `<script type="module" integrity="${exports.SRI_ERROR_HMR_SNOWPACK}" src="${getMetaUrlPath('hmr-error-overlay.js', config)}"></script>`;
        }
        code = util_1.appendHtmlToHead(code, hmrScript);
    }
    return code;
}
exports.wrapHtmlResponse = wrapHtmlResponse;
function generateJsonImportProxy({ code, hmr, config, }) {
    const jsonImportProxyCode = `let json = ${JSON.stringify(JSON.parse(code))};
export default json;`;
    return wrapImportMeta({ code: jsonImportProxyCode, hmr, env: false, config });
}
function generateCssImportProxy({ code, hmr, config, }) {
    const cssImportProxyCode = `// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {${hmr
        ? `
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    document.head.removeChild(styleEl);
  });\n`
        : ''}
  const code = ${JSON.stringify(code)};

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}`;
    return wrapImportMeta({ code: cssImportProxyCode, hmr, env: false, config });
}
function createImportGlobValue(importGlob, i) {
    let value;
    let imports;
    if (importGlob.isEager) {
        value = `{\n${importGlob.resolvedImports
            .map((spec, j, { length: len }) => `\t"${spec}": __glob__${i}_${j}${j === len - 1 ? '' : ','}`)
            .join('\n')}\n}`;
        imports = importGlob.resolvedImports
            .map((spec, j) => `import * as __glob__${i}_${j} from '${spec}';`)
            .join('\n');
    }
    else {
        value = `{\n${importGlob.resolvedImports
            .map((spec, j, { length: len }) => `\t"${spec}": () => import("${spec}")${j === len - 1 ? '' : ','}`)
            .join('\n')}\n}`;
        imports = '';
    }
    return { value, imports };
}
async function transformGlobImports({ contents: _code, resolveImportGlobSpecifier = async (i) => [i], }) {
    const importGlobs = scan_import_glob_1.scanImportGlob(_code);
    let rewrittenCode = _code;
    const resolvedImportGlobs = await Promise.all(importGlobs.reverse().map(({ glob, ...importGlob }) => {
        return resolveImportGlobSpecifier(glob).then((resolvedImports) => ({
            ...importGlob,
            glob,
            resolvedImports,
        }));
    }));
    resolvedImportGlobs.forEach((importGlob, i) => {
        const { value, imports } = createImportGlobValue(importGlob, i);
        rewrittenCode = util_1.spliceString(rewrittenCode, value, importGlob.start, importGlob.end);
        if (imports) {
            rewrittenCode = `${imports}\n${rewrittenCode}`;
        }
    });
    return rewrittenCode;
}
exports.transformGlobImports = transformGlobImports;
async function generateCssModuleImportProxy({ url, code, hmr, config, }) {
    const reqUrl = url.replace(new RegExp(`^${config.buildOptions.baseUrl}`), '/'); // note: in build, buildOptions.baseUrl gets prepended. Remove that for looking up CSS Module code
    return `
export let code = ${JSON.stringify(code)};
let json = ${import_css_1.cssModuleJSON(reqUrl)};
export default json;
${hmr
        ? `
import * as __SNOWPACK_HMR_API__ from '${getMetaUrlPath('hmr-client.js', config)}';
import.meta.hot = __SNOWPACK_HMR_API__.createHotContext(import.meta.url);\n`
        : ``}
// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {${hmr
        ? `
  import.meta.hot.dispose(() => {
    document && document.head.removeChild(styleEl);
  });\n`
        : ``}
  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';

  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}`;
}
function generateDefaultImportProxy(url) {
    return `export default ${JSON.stringify(url)};`;
}
async function wrapImportProxy({ url, code, hmr, config, }) {
    if (util_1.hasExtension(url, '.json')) {
        return generateJsonImportProxy({ code: code.toString(), hmr, config });
    }
    if (util_1.hasExtension(url, '.css')) {
        // if proxying a CSS file, remove its source map (the path no longer applies)
        const sanitized = code.toString().replace(/\/\*#\s*sourceMappingURL=[^/]+\//gm, '');
        return util_1.hasExtension(url, '.module.css')
            ? generateCssModuleImportProxy({ url, code: sanitized, hmr, config })
            : generateCssImportProxy({ code: sanitized, hmr, config });
    }
    return generateDefaultImportProxy(url);
}
exports.wrapImportProxy = wrapImportProxy;
function generateEnvModule({ mode, isSSR, configEnv, }) {
    const envObject = {
        ...getSnowpackPublicEnvVariables(),
        ...(configEnv !== null && configEnv !== void 0 ? configEnv : {}),
        MODE: mode,
        NODE_ENV: mode,
        SSR: isSSR,
    };
    return Object.entries(envObject)
        .map(([key, val]) => {
        return `export const ${key} = ${JSON.stringify(val)};`;
    })
        .join('\n');
}
exports.generateEnvModule = generateEnvModule;
const PUBLIC_ENV_REGEX = /^SNOWPACK_PUBLIC_.+/;
function getSnowpackPublicEnvVariables() {
    const envObject = { ...process.env };
    for (const env of Object.keys(envObject)) {
        if (!PUBLIC_ENV_REGEX.test(env)) {
            delete envObject[env];
        }
    }
    return envObject;
}
