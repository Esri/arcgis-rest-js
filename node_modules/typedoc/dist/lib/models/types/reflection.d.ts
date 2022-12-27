import { DeclarationReflection } from "../reflections/declaration";
import { Type } from "./abstract";
/**
 * Represents a type which has it's own reflection like literal types.
 *
 * ~~~
 * let value: {subValueA;subValueB;subValueC;};
 * ~~~
 */
export declare class ReflectionType extends Type {
    /**
     * The reflection of the type.
     */
    declaration: DeclarationReflection;
    /**
     * The type name identifier.
     */
    readonly type = "reflection";
    /**
     * Create a new instance of ReflectionType.
     *
     * @param declaration  The reflection of the type.
     */
    constructor(declaration: DeclarationReflection);
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone(): Type;
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type: ReflectionType): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): "object" | "function";
}
