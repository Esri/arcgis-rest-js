"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeParameterReflectionSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class TypeParameterReflectionSerializer extends components_1.ReflectionSerializerComponent {
    supports(t) {
        return t instanceof models_1.TypeParameterReflection;
    }
    toObject(typeParameter, obj) {
        return {
            ...obj,
            type: this.owner.toObject(typeParameter.type),
            default: this.owner.toObject(typeParameter.default),
        };
    }
}
exports.TypeParameterReflectionSerializer = TypeParameterReflectionSerializer;
