import { Type } from "./abstract";
/**
 * Represents an optional type
 * ```ts
 * type Z = [1, 2?]
 * //           ^^
 * ```
 */
export declare class OptionalType extends Type {
    /**
     * The type of the rest array elements.
     */
    elementType: Type;
    /**
     * The type name identifier.
     */
    readonly type = "optional";
    /**
     * Create a new OptionalType instance.
     *
     * @param elementType The type of the element
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
