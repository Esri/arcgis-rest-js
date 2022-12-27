import { Type } from "./abstract";
/**
 * TS 4.1 template literal types
 * ```ts
 * type Z = `${'a' | 'b'}${'a' | 'b'}`
 * ```
 */
export declare class TemplateLiteralType extends Type {
    readonly type = "template-literal";
    head: string;
    tail: [Type, string][];
    constructor(head: string, tail: [Type, string][]);
    clone(): Type;
    equals(other: Type): boolean;
    toString(): string;
}
