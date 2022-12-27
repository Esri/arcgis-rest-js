import type * as ts from "typescript";
import type { ProjectReflection } from "../reflections";
import { Reflection } from "../reflections/abstract";
import { Type } from "./abstract";
/**
 * Represents a type that refers to another reflection like a class, interface or enum.
 *
 * ~~~
 * let value: MyClass;
 * ~~~
 */
export declare class ReferenceType extends Type {
    /**
     * The type name identifier.
     */
    readonly type = "reference";
    /**
     * The name of the referenced type.
     *
     * If the symbol cannot be found cause it's not part of the documentation this
     * can be used to represent the type.
     */
    name: string;
    /**
     * The type arguments of this reference.
     */
    typeArguments?: Type[];
    /**
     * The resolved reflection.
     */
    get reflection(): Reflection | undefined;
    /**
     * Horrible hacky solution to get around Handlebars messing with `this` in bad ways.
     * Don't use this if possible, it will go away once we use something besides handlebars for themes.
     */
    getReflection: () => Reflection | undefined;
    private _target;
    private _project;
    /**
     * Create a new instance of ReferenceType.
     */
    constructor(name: string, target: ts.Symbol | Reflection | number, project: ProjectReflection);
    /** @internal this is used for type parameters, which don't actually point to something */
    static createBrokenReference(name: string, project: ProjectReflection): ReferenceType;
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
    equals(other: ReferenceType): boolean;
    /**
     * Return a string representation of this type.
     * @example EventEmitter<any>
     */
    toString(): string;
}
