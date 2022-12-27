"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNamedNode = void 0;
const ts = require("typescript");
function isNamedNode(node) {
    const name = node.name;
    return (!!name &&
        (ts.isIdentifierOrPrivateIdentifier(name) ||
            ts.isComputedPropertyName(name)));
}
exports.isNamedNode = isNamedNode;
