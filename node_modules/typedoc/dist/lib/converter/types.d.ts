import * as ts from "typescript";
import { Type } from "../models";
import { Context } from "./context";
export interface TypeConverter<TNode extends ts.TypeNode = ts.TypeNode, TType extends ts.Type = ts.Type> {
    kind: TNode["kind"][];
    convert(context: Context, node: TNode): Type;
    convertType(context: Context, type: TType, node: TNode): Type;
}
export declare function loadConverters(): void;
export declare function convertType(context: Context, typeOrNode: ts.Type | ts.TypeNode | undefined): Type;
