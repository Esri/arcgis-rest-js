import { ConverterComponent } from "../components";
/**
 * A handler that moves comments with dot syntax to their target.
 */
export declare class DeepCommentPlugin extends ConverterComponent {
    /**
     * Create a new CommentHandler instance.
     */
    initialize(): void;
    /**
     * Triggered when the converter begins resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onBeginResolve;
}
