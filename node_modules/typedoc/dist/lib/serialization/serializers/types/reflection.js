"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class ReflectionTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.ReflectionType;
    }
    toObject(reference, obj) {
        const result = {
            ...obj,
            declaration: this.owner.toObject(reference.declaration),
        };
        return result;
    }
}
exports.ReflectionTypeSerializer = ReflectionTypeSerializer;
