"use strict";
// Converter functions for JSDoc defined types
// @typedef
// @callback
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJsDocCallback = exports.convertJsDocAlias = void 0;
const assert_1 = require("assert");
const ts = require("typescript");
const models_1 = require("../models");
const array_1 = require("../utils/array");
const converter_events_1 = require("./converter-events");
const signature_1 = require("./factories/signature");
function convertJsDocAlias(context, symbol, declaration, exportSymbol) {
    var _a;
    if (declaration.typeExpression &&
        ts.isJSDocTypeLiteral(declaration.typeExpression)) {
        convertJsDocInterface(context, declaration, symbol, exportSymbol);
        return;
    }
    const reflection = context.createDeclarationReflection(models_1.ReflectionKind.TypeAlias, symbol, exportSymbol);
    reflection.type = context.converter.convertType(context.withScope(reflection), (_a = declaration.typeExpression) === null || _a === void 0 ? void 0 : _a.type);
    convertTemplateParameters(context.withScope(reflection), declaration.parent);
    context.finalizeDeclarationReflection(reflection, symbol, exportSymbol);
}
exports.convertJsDocAlias = convertJsDocAlias;
function convertJsDocCallback(context, symbol, declaration, exportSymbol) {
    const alias = context.createDeclarationReflection(models_1.ReflectionKind.TypeAlias, symbol, exportSymbol);
    context.finalizeDeclarationReflection(alias, symbol, exportSymbol);
    const ac = context.withScope(alias);
    alias.type = convertJsDocSignature(ac, declaration.typeExpression);
    convertTemplateParameters(ac, declaration.parent);
}
exports.convertJsDocCallback = convertJsDocCallback;
function convertJsDocInterface(context, declaration, symbol, exportSymbol) {
    const reflection = context.createDeclarationReflection(models_1.ReflectionKind.Interface, symbol, exportSymbol);
    context.finalizeDeclarationReflection(reflection, symbol, exportSymbol);
    const rc = context.withScope(reflection);
    const type = context.checker.getDeclaredTypeOfSymbol(symbol);
    for (const s of type.getProperties()) {
        context.converter.convertSymbol(rc, s);
    }
    convertTemplateParameters(rc, declaration.parent);
}
function convertJsDocSignature(context, node) {
    var _a, _b, _c;
    const symbol = (_a = context.getSymbolAtLocation(node)) !== null && _a !== void 0 ? _a : node.symbol;
    const type = context.getTypeAtLocation(node);
    if (!symbol || !type) {
        return new models_1.IntrinsicType("Function");
    }
    const reflection = new models_1.DeclarationReflection("__type", models_1.ReflectionKind.TypeLiteral, context.scope);
    context.registerReflection(reflection, symbol);
    context.trigger(converter_events_1.ConverterEvents.CREATE_DECLARATION, reflection, node);
    const signature = new models_1.SignatureReflection("__type", models_1.ReflectionKind.CallSignature, reflection);
    context.registerReflection(signature, void 0);
    const signatureCtx = context.withScope(signature);
    reflection.signatures = [signature];
    signature.type = context.converter.convertType(signatureCtx, (_c = (_b = node.type) === null || _b === void 0 ? void 0 : _b.typeExpression) === null || _c === void 0 ? void 0 : _c.type);
    signature.parameters = (0, signature_1.convertParameterNodes)(signatureCtx, signature, node.parameters);
    signature.typeParameters = convertTemplateParameterNodes(context.withScope(reflection), node.typeParameters);
    return new models_1.ReflectionType(reflection);
}
function convertTemplateParameters(context, node) {
    var _a;
    (0, assert_1.ok)(context.scope instanceof models_1.DeclarationReflection);
    context.scope.typeParameters = convertTemplateParameterNodes(context, (_a = node.tags) === null || _a === void 0 ? void 0 : _a.filter(ts.isJSDocTemplateTag));
}
function convertTemplateParameterNodes(context, nodes) {
    const params = (0, array_1.flatMap)(nodes !== null && nodes !== void 0 ? nodes : [], (tag) => tag.typeParameters);
    return (0, signature_1.convertTypeParameterNodes)(context, params);
}
