"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentTagSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class CommentTagSerializer extends components_1.SerializerComponent {
    /**
     * Filter for instances of [[CommentTag]]
     */
    serializeGroup(instance) {
        return instance instanceof models_1.CommentTag;
    }
    supports(_t) {
        return true;
    }
    toObject(tag, obj = {}) {
        const result = {
            tag: tag.tagName,
            text: tag.text,
        };
        if (tag.paramName) {
            result.param = tag.paramName;
        }
        return { ...obj, ...result };
    }
}
exports.CommentTagSerializer = CommentTagSerializer;
CommentTagSerializer.PRIORITY = 1000;
