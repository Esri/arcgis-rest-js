import { Type } from "./abstract";
/**
 * Represents an inferred type, U in the example below.
 *
 * ```ts
 * type Z = Promise<string> extends Promise<infer U> : never
 * ```
 */
export declare class InferredType extends Type {
    name: string;
    /**
     * The type name identifier.
     */
    readonly type: string;
    constructor(name: string);
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
    equals(type: unknown): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
}
