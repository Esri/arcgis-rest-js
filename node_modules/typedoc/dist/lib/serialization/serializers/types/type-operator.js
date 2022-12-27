"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOperatorTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class TypeOperatorTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.TypeOperatorType;
    }
    toObject(type, obj) {
        return {
            ...obj,
            operator: type.operator,
            target: this.owner.toObject(type.target),
        };
    }
}
exports.TypeOperatorTypeSerializer = TypeOperatorTypeSerializer;
