"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionCategorySerializer = void 0;
const ReflectionCategory_1 = require("../../models/ReflectionCategory");
const components_1 = require("../components");
class ReflectionCategorySerializer extends components_1.SerializerComponent {
    /**
     * Filter for instances of [[ReflectionCategory]]
     */
    serializeGroup(instance) {
        return instance instanceof ReflectionCategory_1.ReflectionCategory;
    }
    supports(r) {
        return r instanceof ReflectionCategory_1.ReflectionCategory;
    }
    toObject(category, obj) {
        const result = {
            ...obj,
            title: category.title,
        };
        if (category.children && category.children.length > 0) {
            result.children = category.children.map((child) => child.id);
        }
        return result;
    }
}
exports.ReflectionCategorySerializer = ReflectionCategorySerializer;
ReflectionCategorySerializer.PRIORITY = 1000;
