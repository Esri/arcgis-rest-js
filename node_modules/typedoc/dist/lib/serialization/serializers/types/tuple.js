"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedTupleMemberTypeSerializer = exports.TupleTypeSerializer = void 0;
const models_1 = require("../../../models");
const tuple_1 = require("../../../models/types/tuple");
const components_1 = require("../../components");
class TupleTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.TupleType;
    }
    toObject(tuple, obj) {
        const result = { ...obj };
        if (tuple.elements && tuple.elements.length > 0) {
            result.elements = tuple.elements.map((t) => this.owner.toObject(t));
        }
        return result;
    }
}
exports.TupleTypeSerializer = TupleTypeSerializer;
class NamedTupleMemberTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof tuple_1.NamedTupleMember;
    }
    toObject(tuple, obj) {
        return {
            ...obj,
            name: tuple.name,
            isOptional: tuple.isOptional,
            element: this.owner.toObject(tuple.element),
        };
    }
}
exports.NamedTupleMemberTypeSerializer = NamedTupleMemberTypeSerializer;
