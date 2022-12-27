import { Type } from "./abstract";
import { ReferenceType } from "./reference";
/**
 * Represents a type that is constructed by querying the type of a reflection.
 * ```ts
 * const x = 1
 * type Z = typeof x // query on reflection for x
 * ```
 */
export declare class QueryType extends Type {
    readonly queryType: ReferenceType;
    readonly type = "query";
    constructor(reference: ReferenceType);
    clone(): Type;
    equals(other: Type): boolean;
    toString(): string;
}
