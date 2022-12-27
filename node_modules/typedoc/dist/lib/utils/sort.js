"use strict";
/**
 * Module which handles sorting reflections according to a user specified strategy.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortReflections = exports.SORT_STRATEGIES = void 0;
const abstract_1 = require("../models/reflections/abstract");
exports.SORT_STRATEGIES = [
    "source-order",
    "alphabetical",
    "enum-value-ascending",
    "enum-value-descending",
    "static-first",
    "instance-first",
    "visibility",
    "required-first",
    "kind",
];
// Return true if a < b
const sorts = {
    "source-order"(a, b) {
        var _a, _b;
        const aSymbol = a.project.getSymbolFromReflection(a);
        const bSymbol = b.project.getSymbolFromReflection(b);
        // This is going to be somewhat ambiguous. No way around that. Treat the first
        // declaration of a symbol as its ordering declaration.
        const aDecl = (_a = aSymbol === null || aSymbol === void 0 ? void 0 : aSymbol.getDeclarations()) === null || _a === void 0 ? void 0 : _a[0];
        const bDecl = (_b = bSymbol === null || bSymbol === void 0 ? void 0 : bSymbol.getDeclarations()) === null || _b === void 0 ? void 0 : _b[0];
        if (aDecl && bDecl) {
            const aFile = aDecl.getSourceFile().fileName;
            const bFile = bDecl.getSourceFile().fileName;
            if (aFile < bFile) {
                return true;
            }
            if (aFile == bFile && aDecl.pos < bDecl.pos) {
                return true;
            }
            return false;
        }
        // Someone is doing something weird. Fail to re-order. This *might* be a bug in TD
        // but it could also be TS having some exported symbol without a declaration.
        return false;
    },
    alphabetical(a, b) {
        return a.name < b.name;
    },
    "enum-value-ascending"(a, b) {
        var _a, _b;
        if (a.kind == abstract_1.ReflectionKind.EnumMember &&
            b.kind == abstract_1.ReflectionKind.EnumMember) {
            return (parseFloat((_a = a.defaultValue) !== null && _a !== void 0 ? _a : "0") <
                parseFloat((_b = b.defaultValue) !== null && _b !== void 0 ? _b : "0"));
        }
        return false;
    },
    "enum-value-descending"(a, b) {
        var _a, _b;
        if (a.kind == abstract_1.ReflectionKind.EnumMember &&
            b.kind == abstract_1.ReflectionKind.EnumMember) {
            return (parseFloat((_a = b.defaultValue) !== null && _a !== void 0 ? _a : "0") <
                parseFloat((_b = a.defaultValue) !== null && _b !== void 0 ? _b : "0"));
        }
        return false;
    },
    "static-first"(a, b) {
        return a.flags.isStatic && !b.flags.isStatic;
    },
    "instance-first"(a, b) {
        return !a.flags.isStatic && b.flags.isStatic;
    },
    visibility(a, b) {
        // Note: flags.isPublic may not be set on public members. It will only be set
        // if the user explicitly marks members as public. Therefore, we can't use it
        // here to get a reliable sort order.
        if (a.flags.isPrivate) {
            return false; // Not sorted before anything
        }
        if (a.flags.isProtected) {
            return b.flags.isPrivate; // Sorted before privates
        }
        if (b.flags.isPrivate || b.flags.isProtected) {
            return true; // We are public, sort before b if b is less visible
        }
        return false;
    },
    "required-first"(a, b) {
        return !a.flags.isOptional && b.flags.isOptional;
    },
    kind(a, b) {
        const weights = [
            abstract_1.ReflectionKind.Reference,
            abstract_1.ReflectionKind.Project,
            abstract_1.ReflectionKind.Module,
            abstract_1.ReflectionKind.Namespace,
            abstract_1.ReflectionKind.Enum,
            abstract_1.ReflectionKind.EnumMember,
            abstract_1.ReflectionKind.Class,
            abstract_1.ReflectionKind.Interface,
            abstract_1.ReflectionKind.TypeAlias,
            abstract_1.ReflectionKind.Constructor,
            abstract_1.ReflectionKind.Event,
            abstract_1.ReflectionKind.Property,
            abstract_1.ReflectionKind.Variable,
            abstract_1.ReflectionKind.Function,
            abstract_1.ReflectionKind.Accessor,
            abstract_1.ReflectionKind.Method,
            abstract_1.ReflectionKind.ObjectLiteral,
            abstract_1.ReflectionKind.Parameter,
            abstract_1.ReflectionKind.TypeParameter,
            abstract_1.ReflectionKind.TypeLiteral,
            abstract_1.ReflectionKind.CallSignature,
            abstract_1.ReflectionKind.ConstructorSignature,
            abstract_1.ReflectionKind.IndexSignature,
            abstract_1.ReflectionKind.GetSignature,
            abstract_1.ReflectionKind.SetSignature,
        ];
        return weights.indexOf(a.kind) < weights.indexOf(b.kind);
    },
};
function sortReflections(strategies, strats) {
    strategies.sort((a, b) => {
        for (const s of strats) {
            if (sorts[s](a, b)) {
                return -1;
            }
            if (sorts[s](b, a)) {
                return 1;
            }
        }
        return 0;
    });
}
exports.sortReflections = sortReflections;
