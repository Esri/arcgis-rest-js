import { Comment } from "../../../models";
import { SerializerComponent } from "../../components";
import { Comment as JSONComment } from "../../schema";
export declare class CommentSerializer extends SerializerComponent<Comment> {
    static PRIORITY: number;
    /**
     * Filter for instances of [[Comment]]
     */
    serializeGroup(instance: unknown): boolean;
    supports(): boolean;
    toObject(comment: Comment, obj?: Partial<JSONComment>): JSONComment;
}
