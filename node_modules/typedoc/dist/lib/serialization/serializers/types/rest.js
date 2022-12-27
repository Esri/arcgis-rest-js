"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class RestTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.RestType;
    }
    /**
     * Will be run after [[TypeSerializer]] so `type` will already be set.
     * @param type
     * @param obj
     */
    toObject(type, obj) {
        return {
            ...obj,
            elementType: this.owner.toObject(type.elementType),
        };
    }
}
exports.RestTypeSerializer = RestTypeSerializer;
