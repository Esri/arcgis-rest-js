"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class ConditionalTypeSerializer extends components_1.TypeSerializerComponent {
    supports(item) {
        return item instanceof models_1.ConditionalType;
    }
    toObject(conditional, obj) {
        return {
            ...obj,
            checkType: this.owner.toObject(conditional.checkType),
            extendsType: this.owner.toObject(conditional.extendsType),
            trueType: this.owner.toObject(conditional.trueType),
            falseType: this.owner.toObject(conditional.falseType),
        };
    }
}
exports.ConditionalTypeSerializer = ConditionalTypeSerializer;
