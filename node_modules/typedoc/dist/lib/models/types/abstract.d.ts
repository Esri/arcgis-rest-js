/**
 * Base class of all type definitions.
 *
 * Instances of this class are also used to represent the type `void`.
 */
export declare abstract class Type {
    /**
     * The type name identifier.
     */
    readonly type: string;
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    abstract clone(): Type;
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(_type: Type): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
    /**
     * Test whether the two given list of types contain equal types.
     *
     * @param a
     * @param b
     */
    static isTypeListSimilar(a: Type[], b: Type[]): boolean;
    /**
     * Test whether the two given list of types are equal.
     *
     * @param a
     * @param b
     */
    static isTypeListEqual(a: Type[], b: Type[]): boolean;
}
