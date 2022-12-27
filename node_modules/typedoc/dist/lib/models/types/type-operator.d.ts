import { Type } from "./abstract";
/**
 * Represents a type operator type.
 *
 * ~~~
 * class A {}
 * class B<T extends keyof A> {}
 * ~~~
 */
export declare class TypeOperatorType extends Type {
    target: Type;
    operator: "keyof" | "unique" | "readonly";
    /**
     * The type name identifier.
     */
    readonly type = "typeOperator";
    constructor(target: Type, operator: "keyof" | "unique" | "readonly");
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
    equals(type: TypeOperatorType): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
}
