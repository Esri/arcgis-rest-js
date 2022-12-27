"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertIndexSignature = void 0;
const assert = require("assert");
const ts = require("typescript");
const models_1 = require("../../models");
const converter_events_1 = require("../converter-events");
function convertIndexSignature(context, symbol) {
    var _a, _b;
    assert(context.scope instanceof models_1.DeclarationReflection);
    const indexSymbol = (_a = symbol.members) === null || _a === void 0 ? void 0 : _a.get("__index");
    if (indexSymbol) {
        // Right now TypeDoc models don't have a way to distinguish between string
        // and number index signatures... { [x: string]: 1 | 2; [x: number]: 2 }
        // will be misrepresented.
        const indexDeclaration = (_b = indexSymbol.getDeclarations()) === null || _b === void 0 ? void 0 : _b[0];
        assert(indexDeclaration && ts.isIndexSignatureDeclaration(indexDeclaration));
        const param = indexDeclaration.parameters[0];
        assert(param && ts.isParameter(param));
        const index = new models_1.SignatureReflection("__index", models_1.ReflectionKind.IndexSignature, context.scope);
        index.parameters = [
            new models_1.ParameterReflection(param.name.getText(), models_1.ReflectionKind.Parameter, index),
        ];
        index.parameters[0].type = context.converter.convertType(context.withScope(index.parameters[0]), param.type);
        index.type = context.converter.convertType(context.withScope(index), indexDeclaration.type);
        context.registerReflection(index, indexSymbol);
        context.scope.indexSignature = index;
        context.trigger(converter_events_1.ConverterEvents.CREATE_SIGNATURE, index, indexDeclaration);
    }
}
exports.convertIndexSignature = convertIndexSignature;
