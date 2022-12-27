import { Type } from "../types/index";
import { Reflection, DefaultValueContainer, TypeContainer, TraverseCallback } from "./abstract";
import { SignatureReflection } from "./signature";
export declare class ParameterReflection extends Reflection implements DefaultValueContainer, TypeContainer {
    parent?: SignatureReflection;
    defaultValue?: string;
    type?: Type;
    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    traverse(callback: TraverseCallback): void;
    /**
     * Return a string representation of this reflection.
     */
    toString(): string;
}
