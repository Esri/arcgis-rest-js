"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertExpression = exports.convertDefaultValue = void 0;
const ts = require("typescript");
/**
 * Return the default value of the given node.
 *
 * @param node  The TypeScript node whose default value should be extracted.
 * @returns The default value as a string.
 */
function convertDefaultValue(node) {
    const anyNode = node;
    if (anyNode === null || anyNode === void 0 ? void 0 : anyNode.initializer) {
        return convertExpression(anyNode.initializer);
    }
    else {
        return undefined;
    }
}
exports.convertDefaultValue = convertDefaultValue;
function convertExpression(expression) {
    switch (expression.kind) {
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.TrueKeyword:
        case ts.SyntaxKind.FalseKeyword:
        case ts.SyntaxKind.NullKeyword:
        case ts.SyntaxKind.NumericLiteral:
        case ts.SyntaxKind.PrefixUnaryExpression:
            return expression.getText();
    }
    if (ts.isArrayLiteralExpression(expression) &&
        expression.elements.length === 0) {
        return "[]";
    }
    if (ts.isObjectLiteralExpression(expression) &&
        expression.properties.length === 0) {
        return "{}";
    }
    // More complex expressions are generally not useful in the documentation.
    // Show that there was a value, but not specifics.
    return "...";
}
exports.convertExpression = convertExpression;
