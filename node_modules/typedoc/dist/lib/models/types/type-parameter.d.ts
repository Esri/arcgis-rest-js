import { Type } from "./abstract";
/**
 * Represents a type parameter type.
 *
 * ~~~
 * let value: T;
 * ~~~
 */
export declare class TypeParameterType extends Type {
    /**
     *
     */
    readonly name: string;
    constraint?: Type;
    /**
     * Default type for the type parameter.
     *
     * ```
     * class SomeClass<T = {}>
     * ```
     */
    default?: Type;
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
    equals(type: TypeParameterType): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
}
