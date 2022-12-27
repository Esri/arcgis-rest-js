"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
const models_2 = require("../models");
class ReflectionSerializer extends components_1.ReflectionSerializerComponent {
    supports(t) {
        return t instanceof models_1.Reflection;
    }
    toObject(reflection, obj) {
        var _a;
        const result = {
            ...obj,
            id: reflection.id,
            name: reflection.name,
            kind: reflection.kind,
            kindString: reflection.kindString,
            flags: {},
            comment: this.owner.toObject(reflection.comment),
            decorates: this.owner.toObject(reflection.decorates),
            decorators: this.owner.toObject((_a = reflection.decorators) === null || _a === void 0 ? void 0 : _a.map((d) => new models_2.DecoratorWrapper(d))),
        };
        if (reflection.originalName !== reflection.name) {
            result.originalName = reflection.originalName;
        }
        const flags = [
            "isPrivate",
            "isProtected",
            "isPublic",
            "isStatic",
            "isExternal",
            "isOptional",
            "isRest",
            "hasExportAssignment",
            "isAbstract",
            "isConst",
            "isLet",
            "isReadonly",
        ];
        for (const key of flags) {
            if (reflection.flags[key] === true) {
                result.flags[key] = true;
            }
        }
        return result;
    }
}
exports.ReflectionSerializer = ReflectionSerializer;
ReflectionSerializer.PRIORITY = 1000;
