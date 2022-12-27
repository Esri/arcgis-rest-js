"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseComment = exports.getRawComment = exports.getJsDocCommentText = void 0;
const ts = require("typescript");
const index_1 = require("../../models/comments/index");
/**
 * Check whether the given module declaration is the topmost.
 *
 * This function returns TRUE if there is no trailing module defined, in
 * the following example this would be the case only for module <code>C</code>.
 *
 * ```
 * module A.B.C { }
 * ```
 *
 * @param node  The module definition that should be tested.
 * @return TRUE if the given node is the topmost module declaration, FALSE otherwise.
 */
function isTopmostModuleDeclaration(node) {
    return node.getChildren().some(ts.isModuleBlock);
}
/**
 * Return the root module declaration of the given module declaration.
 *
 * In the following example this function would always return module
 * <code>A</code> no matter which of the modules was passed in.
 *
 * ```
 * module A.B.C { }
 * ```
 */
function getRootModuleDeclaration(node) {
    while (node.parent &&
        node.parent.kind === ts.SyntaxKind.ModuleDeclaration) {
        const parent = node.parent;
        if (node.name.pos === parent.name.end + 1) {
            node = parent;
        }
        else {
            break;
        }
    }
    return node;
}
/**
 * Derived from the internal ts utility
 * https://github.com/Microsoft/TypeScript/blob/v3.2.2/src/compiler/utilities.ts#L954
 * @param node
 * @param text
 */
function getJSDocCommentRanges(node, text) {
    var _a, _b;
    const hasTrailingCommentRanges = [
        ts.SyntaxKind.Parameter,
        ts.SyntaxKind.FunctionExpression,
        ts.SyntaxKind.ArrowFunction,
        ts.SyntaxKind.ParenthesizedExpression,
    ].includes(node.kind);
    let commentRanges = (_a = ts.getLeadingCommentRanges(text, node.pos)) !== null && _a !== void 0 ? _a : [];
    if (hasTrailingCommentRanges) {
        commentRanges = ((_b = ts.getTrailingCommentRanges(text, node.pos)) !== null && _b !== void 0 ? _b : []).concat(commentRanges);
    }
    // True if the comment starts with '/**' but not if it is '/**/'
    return commentRanges.filter(({ pos }) => text.substr(pos, 3) === "/**" && text[pos + 4] !== "/");
}
function getJsDocCommentText(comment) {
    if (typeof comment === "string") {
        return comment;
    }
    return comment === null || comment === void 0 ? void 0 : comment.map((val) => val.text).join("");
}
exports.getJsDocCommentText = getJsDocCommentText;
/**
 * Return the raw comment string for the given node.
 *
 * @param node  The node whose comment should be resolved.
 * @returns     The raw comment string or undefined if no comment could be found.
 */
function getRawComment(node, logger) {
    var _a, _b;
    // This happens if we are converting a JS project that has @typedef "interfaces"
    // with an @property tag, a @typedef type alias, a callback with parameters, etc.
    if (ts.isJSDocTypedefTag(node) ||
        ts.isJSDocPropertyTag(node) ||
        ts.isJSDocParameterTag(node) ||
        ts.isJSDocCallbackTag(node)) {
        // Also strip off leading dashes:
        // @property {string} name - docs
        return (_a = getJsDocCommentText(node.comment)) === null || _a === void 0 ? void 0 : _a.replace(/^\s*-\s*/, "");
    }
    if (node.parent &&
        node.parent.kind === ts.SyntaxKind.VariableDeclarationList) {
        node = node.parent.parent;
    }
    else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        if (!isTopmostModuleDeclaration(node)) {
            return;
        }
        else {
            node = getRootModuleDeclaration(node);
        }
    }
    else if (node.kind === ts.SyntaxKind.NamespaceExport) {
        node = node.parent;
    }
    else if (node.kind === ts.SyntaxKind.ExportSpecifier) {
        node = node.parent.parent;
    }
    else if (node.kind === ts.SyntaxKind.FunctionType) {
        node = node.parent;
    }
    const sourceFile = node.getSourceFile();
    const comments = getJSDocCommentRanges(node, sourceFile.text);
    if (comments.length) {
        let comment;
        if (node.kind === ts.SyntaxKind.SourceFile) {
            const explicitPackageComment = (_b = comments.find((comment) => sourceFile.text
                .substring(comment.pos, comment.end)
                .includes("@module"))) !== null && _b !== void 0 ? _b : comments.find((comment) => sourceFile.text
                .substring(comment.pos, comment.end)
                .includes("@packageDocumentation"));
            if (explicitPackageComment) {
                comment = explicitPackageComment;
            }
            else if (comments.length > 1) {
                // Legacy behavior, require more than one comment and use the first comment.
                comment = comments[0];
                logger.deprecated(`Specifying multiple comments at the start of a file to use the first comment as the comment for the module has been deprecated. Use @module or @packageDocumentation instead.\n\t${sourceFile.fileName}`, false);
            }
            else {
                // Single comment that may be a license comment, or no comments, bail.
                return;
            }
        }
        else {
            comment = comments[comments.length - 1];
            // If a non-SourceFile node comment has this tag, it should not be attached to the node
            // as it documents the module.
            if (sourceFile.text
                .substring(comment.pos, comment.end)
                .includes("@module") ||
                sourceFile.text
                    .substring(comment.pos, comment.end)
                    .includes("@packageDocumentation")) {
                return;
            }
        }
        return sourceFile.text.substring(comment.pos, comment.end);
    }
    else {
        return;
    }
}
exports.getRawComment = getRawComment;
/**
 * Parse the given doc comment string.
 *
 * @param text     The doc comment string that should be parsed.
 * @param comment  The {@link Comment} instance the parsed results should be stored into.
 * @returns        A populated {@link Comment} instance.
 */
function parseComment(text, comment = new index_1.Comment()) {
    let currentTag;
    let shortText = 0;
    function consumeTypeData(line) {
        line = line.replace(/^\{(?!@)[^}]*\}+/, "");
        line = line.replace(/^\[[^[][^\]]*\]+/, "");
        return line.trim();
    }
    function readBareLine(line) {
        if (currentTag) {
            currentTag.text += "\n" + line;
        }
        else if (line === "" && shortText === 0) {
            // Ignore
        }
        else if (line === "" && shortText === 1) {
            shortText = 2;
        }
        else {
            if (shortText === 2) {
                comment.text += (comment.text === "" ? "" : "\n") + line;
            }
            else {
                comment.shortText +=
                    (comment.shortText === "" ? "" : "\n") + line;
                shortText = 1;
            }
        }
    }
    function readTagLine(line, tag) {
        let tagName = tag[1].toLowerCase();
        let paramName;
        line = tag[2].trim();
        if (tagName === "return") {
            tagName = "returns";
        }
        if (tagName === "param" ||
            tagName === "typeparam" ||
            tagName === "template" ||
            tagName === "inheritdoc") {
            line = consumeTypeData(line);
            const param = /[^\s]+/.exec(line);
            if (param) {
                paramName = param[0];
                line = line.substr(paramName.length + 1).trim();
            }
            line = consumeTypeData(line);
            line = line.replace(/^-\s+/, "");
        }
        else if (tagName === "returns") {
            line = consumeTypeData(line);
        }
        currentTag = new index_1.CommentTag(tagName, paramName, line);
        comment.tags.push(currentTag);
    }
    const CODE_FENCE = /^\s*```(?!.*```)/;
    let inFencedCode = false;
    function readLine(line) {
        line = line.replace(/^\s*\*? ?/, "");
        const rawLine = line;
        line = line.replace(/\s*$/, "");
        if (CODE_FENCE.test(line)) {
            inFencedCode = !inFencedCode;
        }
        // Four spaces can be used to make code blocks too.
        if (!inFencedCode && !line.startsWith("    ")) {
            const tag = /^\s*@(\S+)(.*)$/.exec(line);
            if (tag) {
                return readTagLine(line, tag);
            }
        }
        if (inFencedCode) {
            // This will not include code blocks declared with four spaces
            readBareLine(rawLine);
        }
        else {
            readBareLine(line);
        }
    }
    text = text.replace(/^\s*\/\*+/, "");
    text = text.replace(/\*+\/\s*$/, "");
    text.split(/\r\n?|\n/).forEach(readLine);
    return comment;
}
exports.parseComment = parseComment;
