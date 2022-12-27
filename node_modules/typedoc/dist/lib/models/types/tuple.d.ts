import { Type } from "./abstract";
/**
 * Represents a tuple type.
 *
 * ~~~
 * let value: [string,boolean];
 * ~~~
 */
export declare class TupleType extends Type {
    /**
     * The ordered type elements of the tuple type.
     */
    elements: Type[];
    /**
     * The type name identifier.
     */
    readonly type = "tuple";
    /**
     * Create a new TupleType instance.
     *
     * @param elements  The ordered type elements of the tuple type.
     */
    constructor(elements: Type[]);
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
    equals(type: TupleType): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
}
export declare class NamedTupleMember extends Type {
    name: string;
    isOptional: boolean;
    element: Type;
    readonly type = "named-tuple-member";
    constructor(name: string, isOptional: boolean, element: Type);
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
