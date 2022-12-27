"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class LiteralTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.LiteralType;
    }
    toObject(type, obj) {
        if (typeof type.value === "bigint") {
            return {
                ...obj,
                value: {
                    value: type.value.toString().replace("-", ""),
                    negative: type.value < BigInt("0"),
                },
            };
        }
        return {
            ...obj,
            value: type.value,
        };
    }
}
exports.LiteralTypeSerializer = LiteralTypeSerializer;
