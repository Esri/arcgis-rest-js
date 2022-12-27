"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLiteralTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class TemplateLiteralTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.TemplateLiteralType;
    }
    toObject(type, obj) {
        return {
            ...obj,
            head: type.head,
            tail: type.tail.map(([type, text]) => [
                this.owner.toObject(type),
                text,
            ]),
        };
    }
}
exports.TemplateLiteralTypeSerializer = TemplateLiteralTypeSerializer;
