"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationReflectionSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
const container_1 = require("./container");
class DeclarationReflectionSerializer extends components_1.ReflectionSerializerComponent {
    supports(t) {
        return t instanceof models_1.DeclarationReflection;
    }
    toObject(d, obj) {
        const result = {
            ...obj,
            typeParameter: this.owner.toObject(d.typeParameters),
            type: this.owner.toObject(d.type),
            signatures: this.owner.toObject(d.signatures),
            indexSignature: this.owner.toObject(d.indexSignature),
        };
        if (d.getSignature) {
            result.getSignature = [this.owner.toObject(d.getSignature)];
        }
        if (d.setSignature) {
            result.setSignature = [this.owner.toObject(d.setSignature)];
        }
        return Object.assign(result, {
            defaultValue: this.owner.toObject(d.defaultValue),
            overwrites: this.owner.toObject(d.overwrites),
            inheritedFrom: this.owner.toObject(d.inheritedFrom),
            implementationOf: this.owner.toObject(d.implementationOf),
            extendedTypes: this.owner.toObject(d.extendedTypes),
            extendedBy: this.owner.toObject(d.extendedBy),
            implementedTypes: this.owner.toObject(d.implementedTypes),
            implementedBy: this.owner.toObject(d.implementedBy),
        });
    }
}
exports.DeclarationReflectionSerializer = DeclarationReflectionSerializer;
DeclarationReflectionSerializer.PRIORITY = container_1.ContainerReflectionSerializer.PRIORITY - 1; // mimic inheritance, run after parent
