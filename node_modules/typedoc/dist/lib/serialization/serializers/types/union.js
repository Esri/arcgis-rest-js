"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class UnionTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.UnionType;
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
exports.UnionTypeSerializer = UnionTypeSerializer;
