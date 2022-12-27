"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureReflectionSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class SignatureReflectionSerializer extends components_1.ReflectionSerializerComponent {
    supports(t) {
        return t instanceof models_1.SignatureReflection;
    }
    toObject(signature, obj) {
        return {
            ...obj,
            typeParameter: this.owner.toObject(signature.typeParameters),
            parameters: this.owner.toObject(signature.parameters),
            type: this.owner.toObject(signature.type),
            overwrites: this.owner.toObject(signature.overwrites),
            inheritedFrom: this.owner.toObject(signature.inheritedFrom),
            implementationOf: this.owner.toObject(signature.implementationOf),
        };
    }
}
exports.SignatureReflectionSerializer = SignatureReflectionSerializer;
