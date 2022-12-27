"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterReflectionSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class ParameterReflectionSerializer extends components_1.ReflectionSerializerComponent {
    supports(t) {
        return t instanceof models_1.ParameterReflection;
    }
    toObject(parameter, obj) {
        const result = {
            ...obj,
            type: this.owner.toObject(parameter.type),
            defaultValue: this.owner.toObject(parameter.defaultValue),
        };
        return result;
    }
}
exports.ParameterReflectionSerializer = ParameterReflectionSerializer;
