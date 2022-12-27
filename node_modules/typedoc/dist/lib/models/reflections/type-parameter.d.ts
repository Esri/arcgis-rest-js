import { Type } from "../types/index";
import { Reflection, TypeContainer } from "./abstract";
import { DeclarationReflection } from "./declaration";
export declare class TypeParameterReflection extends Reflection implements TypeContainer {
    parent?: DeclarationReflection;
    type?: Type;
    default?: Type;
    /**
     * Create a new TypeParameterReflection instance.
     */
    constructor(name: string, constraint?: Type, defaultType?: Type, parent?: Reflection);
}
