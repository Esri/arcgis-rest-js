import { ConverterComponent } from "../components";
/**
 * A handler that attaches source file information to reflections.
 */
export declare class SourcePlugin extends ConverterComponent {
    readonly disableSources: boolean;
    /**
     * A map of all generated [[SourceFile]] instances.
     */
    private fileMappings;
    /**
     * All file names to find the base path from.
     */
    private fileNames;
    private basePath?;
    /**
     * Create a new SourceHandler instance.
     */
    initialize(): void;
    private getSourceFile;
    private onEnd;
    /**
     * Triggered when the converter has created a declaration reflection.
     *
     * Attach the current source file to the [[DeclarationReflection.sources]] array.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently processed.
     * @param node  The node that is currently processed if available.
     */
    private onDeclaration;
    /**
     * Triggered when the converter begins resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onBeginResolve;
    /**
     * Triggered when the converter resolves a reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    private onResolve;
    /**
     * Triggered when the converter has finished resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onEndResolve;
}
