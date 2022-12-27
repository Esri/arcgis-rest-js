import { Type } from "./abstract";
/**
 * Represents an array type.
 *
 * ~~~
 * let value: string[];
 * ~~~
 */
export declare class ArrayType extends Type {
    /**
     * The type of the array elements.
     */
    elementType: Type;
    /**
     * The type name identifier.
     */
    readonly type = "array";
    /**
     * Create a new TupleType instance.
     *
     * @param elementType  The type of the array's elements.
     */
    constructor(elementType: Type);
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
    equals(type: Type): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
}
