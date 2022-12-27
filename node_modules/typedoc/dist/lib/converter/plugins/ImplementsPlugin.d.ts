import { ConverterComponent } from "../components";
/**
 * A plugin that detects interface implementations of functions and
 * properties on classes and links them.
 */
export declare class ImplementsPlugin extends ConverterComponent {
    private resolved;
    private postponed;
    /**
     * Create a new ImplementsPlugin instance.
     */
    initialize(): void;
    /**
     * Mark all members of the given class to be the implementation of the matching interface member.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param classReflection  The reflection of the classReflection class.
     * @param interfaceReflection  The reflection of the interfaceReflection interface.
     */
    private analyzeClass;
    private analyzeInheritance;
    /**
     * Triggered when the converter resolves a reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently resolved.
     */
    private onResolve;
    private tryResolve;
    private doResolve;
    private getExtensionInfo;
    private onSignature;
    /**
     * Responsible for setting the {@link DeclarationReflection.inheritedFrom},
     * {@link DeclarationReflection.overwrites}, and {@link DeclarationReflection.implementationOf}
     * properties on the provided reflection temporarily, these links will be replaced
     * during the resolve step with links which actually point to the right place.
     */
    private onDeclaration;
}
