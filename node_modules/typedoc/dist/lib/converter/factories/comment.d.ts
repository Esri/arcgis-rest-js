import * as ts from "typescript";
import { Comment } from "../../models/comments/index";
import { Logger } from "../../utils";
export declare function getJsDocCommentText(comment: ts.JSDocTag["comment"]): string | undefined;
/**
 * Return the raw comment string for the given node.
 *
 * @param node  The node whose comment should be resolved.
 * @returns     The raw comment string or undefined if no comment could be found.
 */
export declare function getRawComment(node: ts.Node, logger: Logger): string | undefined;
/**
 * Parse the given doc comment string.
 *
 * @param text     The doc comment string that should be parsed.
 * @param comment  The {@link Comment} instance the parsed results should be stored into.
 * @returns        A populated {@link Comment} instance.
 */
export declare function parseComment(text: string, comment?: Comment): Comment;
