"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedTypeSerializer = void 0;
const components_1 = require("../../components");
const models_1 = require("../../../models");
class MappedTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.MappedType;
    }
    toObject(map, obj) {
        return {
            ...obj,
            parameter: map.parameter,
            parameterType: this.owner.toObject(map.parameterType),
            templateType: this.owner.toObject(map.templateType),
            readonlyModifier: map.readonlyModifier,
            optionalModifier: map.optionalModifier,
            nameType: this.owner.toObject(map.nameType),
        };
    }
}
exports.MappedTypeSerializer = MappedTypeSerializer;
