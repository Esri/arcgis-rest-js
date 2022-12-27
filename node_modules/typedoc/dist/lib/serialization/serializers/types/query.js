"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryTypeSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class QueryTypeSerializer extends components_1.TypeSerializerComponent {
    supports(t) {
        return t instanceof models_1.QueryType;
    }
    toObject(type, obj) {
        return {
            ...obj,
            queryType: this.owner.toObject(type.queryType),
        };
    }
}
exports.QueryTypeSerializer = QueryTypeSerializer;
