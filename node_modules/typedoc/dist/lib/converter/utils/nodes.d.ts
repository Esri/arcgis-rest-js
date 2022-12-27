import * as ts from "typescript";
export declare function isNamedNode(node: ts.Node): node is ts.Node & {
    name: ts.Identifier | ts.PrivateIdentifier | ts.ComputedPropertyName;
};
