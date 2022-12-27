import { CommentTag } from "./tag";
/**
 * A model that represents a comment.
 *
 * Instances of this model are created by the [[CommentPlugin]]. You can retrieve comments
 * through the [[DeclarationReflection.comment]] property.
 */
export declare class Comment {
    /**
     * The abstract of the comment. TypeDoc interprets the first paragraph of a comment
     * as the abstract.
     */
    shortText: string;
    /**
     * The full body text of the comment. Excludes the [[shortText]].
     */
    text: string;
    /**
     * The text of the ```@returns``` tag if present.
     */
    returns?: string;
    /**
     * All associated tags.
     */
    tags: CommentTag[];
    /**
     * Creates a new Comment instance.
     */
    constructor(shortText?: string, text?: string);
    /**
     * Has this comment a visible component?
     *
     * @returns TRUE when this comment has a visible component.
     */
    hasVisibleComponent(): boolean;
    /**
     * Test whether this comment contains a tag with the given name.
     *
     * @param tagName  The name of the tag to look for.
     * @returns TRUE when this comment contains a tag with the given name, otherwise FALSE.
     */
    hasTag(tagName: string): boolean;
    /**
     * Return the first tag with the given name.
     *
     * You can optionally pass a parameter name that should be searched to.
     *
     * @param tagName  The name of the tag to look for.
     * @param paramName  An optional parameter name to look for.
     * @returns The found tag or undefined.
     */
    getTag(tagName: string, paramName?: string): CommentTag | undefined;
    /**
     * Removes all tags with the given tag name from teh comment.
     * @param tagName
     */
    removeTags(tagName: string): void;
    /**
     * Copy the data of the given comment into this comment.
     *
     * `shortText`, `text`, `returns` and tags from `COPIED_TAGS` are copied;
     * other instance tags left unchanged.
     *
     * @param comment - Source comment to copy from
     */
    copyFrom(comment: Comment): void;
}
