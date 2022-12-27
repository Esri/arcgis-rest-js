"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentTag = void 0;
/**
 * A model that represents a single javadoc comment tag.
 *
 * Tags are stored in the [[Comment.tags]] property.
 */
class CommentTag {
    /**
     * Create a new CommentTag instance.
     */
    constructor(tagName, paramName, text) {
        this.tagName = tagName;
        this.paramName = paramName || "";
        this.text = text || "";
    }
}
exports.CommentTag = CommentTag;
