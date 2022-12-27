"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedAccessTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class IndexedAccessTypeSerializer extends components_1.TypeSerializerComponent {
    supports(item) {
        return item instanceof models_1.IndexedAccessType;
    }
    toObject(type, obj) {
        return {
            ...obj,
            indexType: this.owner.toObject(type.indexType),
            objectType: this.owner.toObject(type.objectType),
        };
    }
}
exports.IndexedAccessTypeSerializer = IndexedAccessTypeSerializer;
