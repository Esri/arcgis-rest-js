"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAliasedSymbol = void 0;
const ts = require("typescript");
function resolveAliasedSymbol(symbol, checker) {
    while (ts.SymbolFlags.Alias & symbol.flags) {
        symbol = checker.getAliasedSymbol(symbol);
    }
    return symbol;
}
exports.resolveAliasedSymbol = resolveAliasedSymbol;
