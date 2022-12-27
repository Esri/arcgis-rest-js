import { ConverterComponent } from "../components";
/**
 * A plugin that detects decorators.
 */
export declare class DecoratorPlugin extends ConverterComponent {
    private readonly usages;
    /**
     * Create a new ImplementsPlugin instance.
     */
    initialize(): void;
    /**
     * Create an object describing the arguments a decorator is set with.
     *
     * @param args  The arguments resolved from the decorator's call expression.
     * @param signature  The signature definition of the decorator being used.
     * @returns An object describing the decorator parameters,
     */
    private extractArguments;
    /**
     * Triggered when the converter has created a declaration or signature reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently processed.
     * @param node  The node that is currently processed if available.
     */
    private onDeclaration;
    private onBeginResolve;
}
