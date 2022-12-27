import { Type } from "./abstract";
/**
 * Represents a conditional type.
 *
 * ~~~
 * let value: C extends E ? T : F;
 * let value2: Check extends Extends ? True : False;
 * ~~~
 */
export declare class ConditionalType extends Type {
    checkType: Type;
    extendsType: Type;
    trueType: Type;
    falseType: Type;
    /**
     * The type name identifier.
     */
    readonly type: string;
    constructor(checkType: Type, extendsType: Type, trueType: Type, falseType: Type);
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
    equals(type: any): boolean;
    /**
     * Return a string representation of this type.
     */
    toString(): string;
}
