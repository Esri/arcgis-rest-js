"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeParameterTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class TypeParameterTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.TypeParameterType;
    }
    toObject(type, obj) {
        const result = {
            ...obj,
            name: type.name,
        };
        if (type.constraint) {
            result.constraint = this.owner.toObject(type.constraint);
        }
        if (type.default) {
            result.default = this.owner.toObject(type.default);
        }
        return result;
    }
}
exports.TypeParameterTypeSerializer = TypeParameterTypeSerializer;
