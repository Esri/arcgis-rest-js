"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSerializer = void 0;
const models_1 = require("../../../models");
const components_1 = require("../../components");
class CommentSerializer extends components_1.SerializerComponent {
    /**
     * Filter for instances of [[Comment]]
     */
    serializeGroup(instance) {
        return instance instanceof models_1.Comment;
    }
    supports() {
        return true;
    }
    toObject(comment, obj = {}) {
        if (comment.shortText) {
            obj.shortText = comment.shortText;
        }
        if (comment.text) {
            obj.text = comment.text;
        }
        if (comment.returns) {
            obj.returns = comment.returns;
        }
        if (comment.tags.length) {
            obj.tags = comment.tags.map((tag) => this.owner.toObject(tag));
        }
        return obj;
    }
}
exports.CommentSerializer = CommentSerializer;
CommentSerializer.PRIORITY = 1000;
