"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyComment = exports.removeUndefined = void 0;
const models_1 = require("../../models");
function removeUndefined(type) {
    if (type instanceof models_1.UnionType) {
        const types = type.types.filter((t) => !t.equals(new models_1.IntrinsicType("undefined")));
        if (types.length === 1) {
            return types[0];
        }
        type.types = types;
        return type;
    }
    return type;
}
exports.removeUndefined = removeUndefined;
/**
 * Copy the comment of the source reflection to the target reflection.
 *
 * @param target - Reflection with comment containing `inheritdoc` tag
 * @param source - Referenced reflection
 */
function copyComment(target, source) {
    var _a;
    if (target.comment &&
        source.comment &&
        target.comment.hasTag("inheritdoc")) {
        if (target instanceof models_1.DeclarationReflection &&
            source instanceof models_1.DeclarationReflection) {
            target.typeParameters = source.typeParameters;
        }
        if (target instanceof models_1.SignatureReflection &&
            source instanceof models_1.SignatureReflection) {
            target.typeParameters = source.typeParameters;
            /**
             * TSDoc overrides existing parameters entirely with inherited ones, while
             * existing implementation merges them.
             * To avoid breaking things, `inheritDoc` tag is additionally checked for the parameter,
             * so the previous behavior will continue to work.
             *
             * TODO: When breaking change becomes acceptable remove legacy implementation
             */
            if ((_a = target.comment.getTag("inheritdoc")) === null || _a === void 0 ? void 0 : _a.paramName) {
                target.parameters = source.parameters;
            }
            else {
                legacyCopyImplementation(target, source);
            }
        }
        target.comment.removeTags("inheritdoc");
        target.comment.copyFrom(source.comment);
    }
    else if (!target.comment && source.comment) {
        if (target instanceof models_1.DeclarationReflection &&
            source instanceof models_1.DeclarationReflection) {
            target.typeParameters = source.typeParameters;
        }
        target.comment = new models_1.Comment();
        target.comment.copyFrom(source.comment);
    }
}
exports.copyComment = copyComment;
/**
 * Copy comments from source reflection to target reflection, parameters are merged.
 *
 * @param target - Reflection with comment containing `inheritdoc` tag
 * @param source - Parent reflection
 */
function legacyCopyImplementation(target, source) {
    if (target.parameters && source.parameters) {
        for (let index = 0, count = target.parameters.length; index < count; index++) {
            const sourceParameter = source.parameters[index];
            if (sourceParameter && sourceParameter.comment) {
                const targetParameter = target.parameters[index];
                if (!targetParameter.comment) {
                    targetParameter.comment = new models_1.Comment();
                    targetParameter.comment.copyFrom(sourceParameter.comment);
                }
            }
        }
    }
}
