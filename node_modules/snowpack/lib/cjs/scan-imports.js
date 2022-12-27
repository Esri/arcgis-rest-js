"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanImportsFromFiles = exports.scanImports = exports.scanDepList = exports.getWebModuleSpecifierFromCode = exports.matchDynamicImportValue = exports.getInstallTargets = void 0;
const es_module_lexer_1 = require("es-module-lexer");
const glob_1 = __importDefault(require("glob"));
const picomatch_1 = __importDefault(require("picomatch"));
const fdir_1 = require("fdir");
const path_1 = __importDefault(require("path"));
const slash_1 = __importDefault(require("slash"));
const strip_comments_1 = __importDefault(require("strip-comments"));
const logger_1 = require("./logger");
const util_1 = require("./util");
// [@\w] - Match a word-character or @ (valid package name)
// (?!.*(:\/\/)) - Ignore if previous match was a protocol (ex: http://)
const BARE_SPECIFIER_REGEX = /^[@\w](?!.*(:\/\/))/;
const ESM_IMPORT_REGEX = /(?<![^;\n])[ ]*import(?:["'\s]*([\w*${}\n\r\t, ]+)\s*from\s*)?\s*["'](.*?)["']/gm;
const ESM_DYNAMIC_IMPORT_REGEX = /(?<!\.)\bimport\((?:['"].+['"]|`[^$]+`)\)/gm;
const HAS_NAMED_IMPORTS_REGEX = /^[\w\s\,]*\{(.*)\}/s;
const STRIP_AS = /\s+as\s+.*/; // for `import { foo as bar }`, strips “as bar”
const DEFAULT_IMPORT_REGEX = /import\s+(\w)+(,\s\{[\w\s,]*\})?\s+from/s;
async function getInstallTargets(config, knownEntrypoints, scannedFiles) {
    let installTargets = [];
    if (knownEntrypoints.length > 0) {
        installTargets.push(...scanDepList(knownEntrypoints, config.root));
    }
    // TODO: remove this if block; move logic inside scanImports
    if (scannedFiles) {
        installTargets.push(...(await scanImportsFromFiles(scannedFiles, config)));
    }
    else {
        installTargets.push(...(await scanImports(config.mode === 'test', config)));
    }
    return installTargets.filter((dep) => !config.packageOptions.external.some((packageName) => util_1.isImportOfPackage(dep.specifier, packageName)));
}
exports.getInstallTargets = getInstallTargets;
const scannableExts = new Set([
    '.astro',
    '.cjs',
    '.css',
    '.html',
    '.interface',
    '.js',
    '.jsx',
    '.less',
    '.mjs',
    '.sass',
    '.scss',
    '.svelte',
    '.ts',
    '.tsx',
    '.vue',
]);
function isFileScannable(ext) {
    return scannableExts.has(ext); // note: <ScannableExts> needed to keep Set() correct above, but this fn should test any string (hence "as").
}
function matchDynamicImportValue(importStatement) {
    const matched = strip_comments_1.default(importStatement).match(/^\s*('([^']+)'|"([^"]+)")\s*$/m);
    return (matched === null || matched === void 0 ? void 0 : matched[2]) || (matched === null || matched === void 0 ? void 0 : matched[3]) || null;
}
exports.matchDynamicImportValue = matchDynamicImportValue;
function getWebModuleSpecifierFromCode(code, imp) {
    // import.meta: we can ignore
    if (imp.d === -2) {
        return null;
    }
    // Static imports: easy to parse
    if (imp.d === -1) {
        return code.substring(imp.s, imp.e);
    }
    // Dynamic imports: a bit trickier to parse. Today, we only support string literals.
    const importStatement = code.substring(imp.s, imp.e);
    return matchDynamicImportValue(importStatement);
}
exports.getWebModuleSpecifierFromCode = getWebModuleSpecifierFromCode;
/**
 * parses an import specifier, looking for a web modules to install. If a web module is not detected,
 * null is returned.
 */
function parseWebModuleSpecifier(specifier) {
    if (!specifier) {
        return null;
    }
    // If specifier is a "bare module specifier" (ie: package name) just return it directly
    if (BARE_SPECIFIER_REGEX.test(specifier)) {
        return specifier;
    }
    return null;
}
function parseImportStatement(code, imp) {
    const webModuleSpecifier = parseWebModuleSpecifier(getWebModuleSpecifierFromCode(code, imp));
    if (!webModuleSpecifier) {
        return null;
    }
    const importStatement = strip_comments_1.default(code.substring(imp.ss, imp.se));
    if (/^import\s+type/.test(importStatement)) {
        return null;
    }
    const isDynamicImport = imp.d > -1;
    const hasDefaultImport = !isDynamicImport && DEFAULT_IMPORT_REGEX.test(importStatement);
    const hasNamespaceImport = !isDynamicImport && importStatement.includes('*');
    const namedImports = (importStatement.match(HAS_NAMED_IMPORTS_REGEX) || [, ''])[1]
        .split(',') // split `import { a, b, c }` by comma
        .map((name) => name.replace(STRIP_AS, '').trim()) // remove “ as …” and trim
        .filter(util_1.isTruthy);
    return {
        specifier: webModuleSpecifier,
        all: isDynamicImport || (!hasDefaultImport && !hasNamespaceImport && namedImports.length === 0),
        default: hasDefaultImport,
        namespace: hasNamespaceImport,
        named: namedImports,
    };
}
function cleanCodeForParsing(code) {
    code = strip_comments_1.default(code);
    const allMatches = [];
    let match;
    const importRegex = new RegExp(ESM_IMPORT_REGEX);
    while ((match = importRegex.exec(code))) {
        allMatches.push(match);
    }
    const dynamicImportRegex = new RegExp(ESM_DYNAMIC_IMPORT_REGEX);
    while ((match = dynamicImportRegex.exec(code))) {
        allMatches.push(match);
    }
    return allMatches.map(([full]) => full).join('\n');
}
function parseJsForInstallTargets(contents) {
    let imports = [];
    // Attempt #1: Parse the file as JavaScript. JSX and some decorator
    // syntax will break this.
    try {
        imports.push(...es_module_lexer_1.parse(contents)[0]);
    }
    catch (err) {
        // Attempt #2: Parse only the import statements themselves.
        // This lets us guarentee we aren't sending any broken syntax to our parser,
        // but at the expense of possible false +/- caused by our regex extractor.
        contents = cleanCodeForParsing(contents);
        imports.push(...es_module_lexer_1.parse(contents)[0]);
    }
    return (imports
        .map((imp) => parseImportStatement(contents, imp))
        .filter(util_1.isTruthy)
        // Babel macros are not install targets!
        .filter((target) => !/[./]macro(\.js)?$/.test(target.specifier)));
}
function parseCssForInstallTargets(code) {
    const installTargets = [];
    let match;
    const importRegex = new RegExp(util_1.CSS_REGEX);
    while ((match = importRegex.exec(code))) {
        const [, spec] = match;
        const webModuleSpecifier = parseWebModuleSpecifier(spec);
        if (webModuleSpecifier) {
            installTargets.push(util_1.createInstallTarget(webModuleSpecifier));
        }
    }
    return installTargets;
}
function parseFileForInstallTargets({ locOnDisk, baseExt, contents, root, }) {
    const relativeLoc = path_1.default.relative(root, locOnDisk);
    try {
        switch (baseExt) {
            case '.css':
            case '.less':
            case '.sass':
            case '.scss': {
                logger_1.logger.debug(`Scanning ${relativeLoc} for imports as CSS`);
                return parseCssForInstallTargets(contents);
            }
            case '.html':
            case '.svelte':
            case '.interface':
            case '.vue': {
                logger_1.logger.debug(`Scanning ${relativeLoc} for imports as HTML`);
                return [
                    ...parseCssForInstallTargets(extractCssFromHtml(contents)),
                    ...parseJsForInstallTargets(extractJsFromHtml({ contents, baseExt })),
                ];
            }
            case '.astro': {
                logger_1.logger.debug(`Scanning ${relativeLoc} for imports as Astro`);
                return [
                    ...parseCssForInstallTargets(extractCssFromHtml(contents)),
                    ...parseJsForInstallTargets(extractJsFromAstro(contents)),
                ];
            }
            case '.cjs':
            case '.js':
            case '.jsx':
            case '.mjs':
            case '.ts':
            case '.tsx': {
                logger_1.logger.debug(`Scanning ${relativeLoc} for imports as JS`);
                return parseJsForInstallTargets(contents);
            }
            default: {
                logger_1.logger.debug(`Skip scanning ${relativeLoc} for imports (unknown file extension ${baseExt})`);
                return [];
            }
        }
    }
    catch (err) {
        // Another error! No hope left, just abort.
        logger_1.logger.error(`! ${locOnDisk}`);
        throw err;
    }
}
/** Extract only JS within <script type="module"> tags (works for .svelte and .vue files, too) */
function extractJsFromHtml({ contents, baseExt }) {
    // TODO: Replace with matchAll once Node v10 is out of TLS.
    // const allMatches = [...result.matchAll(new RegExp(HTML_JS_REGEX))];
    const allMatches = [];
    let match;
    let regex = new RegExp(util_1.HTML_JS_REGEX);
    if (baseExt === '.svelte' || baseExt === '.interface' || baseExt === '.vue') {
        regex = new RegExp(util_1.SVELTE_VUE_REGEX); // scan <script> tags, not <script type="module">
    }
    while ((match = regex.exec(contents))) {
        allMatches.push(match);
    }
    return allMatches
        .map((match) => match[2]) // match[2] is the code inside the <script></script> element
        .filter((s) => s.trim())
        .join('\n');
}
/** Extract only CSS within <style> tags (works for .svelte and .vue files, too) */
function extractCssFromHtml(contents) {
    // TODO: Replace with matchAll once Node v10 is out of TLS.
    // const allMatches = [...result.matchAll(new RegExp(HTML_JS_REGEX))];
    const allMatches = [];
    let match;
    let regex = new RegExp(util_1.HTML_STYLE_REGEX);
    while ((match = regex.exec(contents))) {
        allMatches.push(match);
    }
    return allMatches
        .map((match) => match[2]) // match[2] is the code inside the <style></style> element
        .filter((s) => s.trim())
        .join('\n');
}
function extractJsFromAstro(contents) {
    const allMatches = [];
    let match;
    let regex = new RegExp(util_1.ASTRO_REGEX);
    // No while loop because we only care about the top frontmatter
    if ((match = regex.exec(contents))) {
        allMatches.push(match);
    }
    return allMatches
        .map((match) => match[1]) // match[1] is the code inside the frontmatter
        .filter((s) => s.trim())
        .join('\n');
}
function scanDepList(depList, cwd) {
    return depList
        .map((whitelistItem) => {
        if (!glob_1.default.hasMagic(whitelistItem)) {
            return [util_1.createInstallTarget(whitelistItem, true)];
        }
        else {
            const nodeModulesLoc = path_1.default.join(cwd, 'node_modules');
            return scanDepList(glob_1.default.sync(whitelistItem, { cwd: nodeModulesLoc, nodir: true }), cwd);
        }
    })
        .reduce((flat, item) => flat.concat(item), []);
}
exports.scanDepList = scanDepList;
async function scanImports(includeTests, config) {
    await es_module_lexer_1.init;
    const includeFileSets = await Promise.all(Object.entries(config.mount).map(async ([fromDisk, mountEntry]) => {
        const allMatchedFiles = (await new fdir_1.fdir()
            .withFullPaths()
            .crawl(fromDisk)
            .withPromise());
        if (mountEntry.dot) {
            return allMatchedFiles;
        }
        return allMatchedFiles.filter((f) => !util_1.IS_DOTFILE_REGEX.test(slash_1.default(f))); // TODO: use a file URL instead
    }));
    const includeFiles = Array.from(new Set([].concat.apply([], includeFileSets)));
    if (includeFiles.length === 0) {
        return [];
    }
    // Scan every matched JS file for web dependency imports
    const excludeGlobs = includeTests
        ? config.exclude
        : [...config.exclude, ...config.testOptions.files];
    const mountedNodeModules = Object.keys(config.mount).filter((v) => v.includes('node_modules'));
    const foundExcludeMatch = picomatch_1.default(excludeGlobs);
    const loadedFiles = await Promise.all(includeFiles.map(async (filePath) => {
        // don’t waste time trying to scan files that aren’t scannable
        if (!isFileScannable(path_1.default.extname(filePath))) {
            return null;
        }
        if (foundExcludeMatch(filePath)) {
            const isMounted = mountedNodeModules.find((mountKey) => filePath.startsWith(mountKey));
            if (!isMounted || (isMounted && foundExcludeMatch(filePath.slice(isMounted.length)))) {
                return null;
            }
        }
        return {
            baseExt: util_1.getExtension(filePath),
            root: config.root,
            locOnDisk: filePath,
            contents: await util_1.readFile(filePath),
        };
    }));
    return scanImportsFromFiles(loadedFiles.filter(util_1.isTruthy), config);
}
exports.scanImports = scanImports;
async function scanImportsFromFiles(loadedFiles, config) {
    await es_module_lexer_1.init;
    return loadedFiles
        .filter((sourceFile) => !Buffer.isBuffer(sourceFile.contents)) // filter out binary files from import scanning
        .map((sourceFile) => parseFileForInstallTargets(sourceFile))
        .reduce((flat, item) => flat.concat(item), [])
        .filter((target) => {
        const aliasEntry = util_1.findMatchingAliasEntry(config, target.specifier);
        return !aliasEntry || aliasEntry.type === 'package';
    })
        .sort((impA, impB) => impA.specifier.localeCompare(impB.specifier));
}
exports.scanImportsFromFiles = scanImportsFromFiles;
