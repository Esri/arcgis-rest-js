import { Type } from "./abstract";
/**
 * Represents a mapped type.
 *
 * ```ts
 * { -readonly [K in keyof U & string as `a${K}`]?: Foo }
 * ```
 */
export declare class MappedType extends Type {
    parameter: string;
    parameterType: Type;
    templateType: Type;
    readonlyModifier?: "+" | "-" | undefined;
    optionalModifier?: "+" | "-" | undefined;
    nameType?: Type | undefined;
    readonly type = "mapped";
    constructor(parameter: string, parameterType: Type, templateType: Type, readonlyModifier?: "+" | "-" | undefined, optionalModifier?: "+" | "-" | undefined, nameType?: Type | undefined);
    clone(): Type;
    equals(other: Type): boolean;
    toString(): string;
}
