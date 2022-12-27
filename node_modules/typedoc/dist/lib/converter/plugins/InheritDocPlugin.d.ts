import { ConverterComponent } from "../components";
/**
 * A plugin that handles `inheritDoc` by copying documentation from another API item.
 *
 * What gets copied:
 * - short text
 * - text
 * - `@remarks` block
 * - `@params` block
 * - `@typeParam` block
 * - `@return` block
 */
export declare class InheritDocPlugin extends ConverterComponent {
    /**
     * Create a new InheritDocPlugin instance.
     */
    initialize(): void;
    /**
     * Triggered when the converter resolves a reflection.
     *
     * Traverse through reflection descendant to check for `inheritDoc` tag.
     * If encountered, the parameter of the tag iss used to determine a source reflection
     * that will provide actual comment.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    private onResolve;
}
