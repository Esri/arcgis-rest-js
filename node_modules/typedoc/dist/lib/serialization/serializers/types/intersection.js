"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class IntersectionTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.IntersectionType;
    }
    /**
     * Will be run after [[TypeSerializer]] so `type` will already be set.
     * @param type
     * @param obj
     */
    toObject(type, obj) {
        return {
            ...obj,
            types: type.types.map((t) => this.owner.toObject(t)),
        };
    }
}
exports.IntersectionTypeSerializer = IntersectionTypeSerializer;
