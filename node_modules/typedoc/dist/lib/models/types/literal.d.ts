import { Type } from "./abstract";
/**
 * Represents a string literal type.
 *
 * ```ts
 * type A = "A"
 * type B = 1
 * ```
 */
export declare class LiteralType extends Type {
    value: string | number | boolean | null | bigint;
    /**
     * The type name identifier.
     */
    readonly type = "literal";
    constructor(value: LiteralType["value"]);
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone(): Type;
    /**
     * Test whether this type equals the given type.
     *
     * @param other  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(other: LiteralType): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
}
