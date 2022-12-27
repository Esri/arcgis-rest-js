import { keywordStart, checkIdent, isEOL } from './lexer-util';
// Specifically NOT using /g here as it is stateful!
const IMPORT_META_GLOB_REGEX = /import\s*\.\s*meta\s*\.\s*glob/;
export function scanImportGlob(code) {
    if (!IMPORT_META_GLOB_REGEX.test(code))
        return [];
    let pos = -1;
    let start = 0;
    let end = 0;
    let state = 0 /* idle */;
    let importGlobs = [];
    let importGlob = null;
    let glob = '';
    while (pos++ < code.length) {
        const ch = code.charAt(pos);
        if (isInQuote(state)) {
            switch (ch) {
                case '"':
                case "'":
                case '`': {
                    state = 0 /* idle */;
                    break;
                }
                default: {
                    glob += ch;
                }
            }
            continue;
        }
        if (isInComment(state)) {
            if (state === 9 /* inSingleLineComment */ && isEOL(code, pos)) {
                state = 0 /* idle */;
            }
            else if (state === 10 /* inMutliLineComment */ && checkIdent(code, pos, '*/')) {
                state = 0 /* idle */;
            }
            else {
                continue;
            }
        }
        switch (ch) {
            case '/': {
                if (isInQuote(state))
                    continue;
                if (code[pos + 1] === '/') {
                    state = 9 /* inSingleLineComment */;
                }
                else if (code[pos + 1] === '*') {
                    state = 10 /* inMutliLineComment */;
                }
                break;
            }
            case 'i': {
                if (keywordStart(code, pos) && checkIdent(code, pos, 'import')) {
                    state = 1 /* inImport */;
                    start = pos;
                }
                break;
            }
            case '.': {
                if (state === 1 /* inImport */) {
                    state = 2 /* maybeImportMeta */;
                }
                break;
            }
            case 'm': {
                if (state === 2 /* maybeImportMeta */ && checkIdent(code, pos, 'meta')) {
                    state = 3 /* onImportMeta */;
                }
                break;
            }
            case 'g': {
                if (state === 3 /* onImportMeta */ && checkIdent(code, pos, 'glob')) {
                    state = 4 /* onImportMetaGlob */;
                    const isEager = checkIdent(code, pos, 'globEager');
                    importGlob = { start, isEager };
                }
                break;
            }
            case '"': {
                state = 6 /* inDoubleQuote */;
                glob = '';
                break;
            }
            case "'": {
                state = 5 /* inSingleQuote */;
                glob = '';
                break;
            }
            case '`': {
                state = 7 /* inTemplateLiteral */;
                glob = '';
                break;
            }
            case '(': {
                if (state === 4 /* onImportMetaGlob */)
                    state = 8 /* inCall */;
                break;
            }
            case ')': {
                state = 0 /* idle */;
                end = pos + 1;
                if (importGlob) {
                    Object.assign(importGlob, { glob, end });
                    importGlobs.push(importGlob);
                    importGlob = null;
                    start = 0;
                    end = 0;
                }
                break;
            }
        }
    }
    return importGlobs;
}
function isInQuote(state) {
    return (state === 6 /* inDoubleQuote */ ||
        state === 5 /* inSingleQuote */ ||
        state === 7 /* inTemplateLiteral */);
}
function isInComment(state) {
    return state === 9 /* inSingleLineComment */ || state === 10 /* inMutliLineComment */;
}
