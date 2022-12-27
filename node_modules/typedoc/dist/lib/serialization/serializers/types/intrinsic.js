"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrinsicTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class IntrinsicTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.IntrinsicType;
    }
    /**
     * Will be run after [[TypeSerializer]] so `type` will already be set.
     * @param type
     * @param obj
     */
    toObject(type, obj) {
        return {
            ...obj,
            name: type.name,
        };
    }
}
exports.IntrinsicTypeSerializer = IntrinsicTypeSerializer;
