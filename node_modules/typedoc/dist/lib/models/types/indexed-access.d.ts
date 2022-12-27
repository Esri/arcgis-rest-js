import { Type } from "./abstract";
/**
 * Represents an indexed access type.
 */
export declare class IndexedAccessType extends Type {
    objectType: Type;
    indexType: Type;
    /**
     * The type name identifier.
     */
    readonly type = "indexedAccess";
    /**
     * Create a new TupleType instance.
     *
     * @param elementType  The type of the array's elements.
     */
    constructor(objectType: Type, indexType: Type);
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
