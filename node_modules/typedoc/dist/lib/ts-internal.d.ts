import * as ts from "typescript";
/**
 * Expose the internal TypeScript APIs that are used by TypeDoc
 */
declare module "typescript" {
    interface Node {
        symbol?: ts.Symbol;
    }
    interface Symbol {
        checkFlags?: CheckFlags;
    }
    interface TypeChecker {
        getTypePredicateOfSignature(signature: ts.Signature): ts.TypePredicate | undefined;
    }
    interface UnionType {
        origin?: ts.Type;
    }
    enum CheckFlags {
        Instantiated = 1,
        SyntheticProperty = 2,
        SyntheticMethod = 4,
        Readonly = 8,
        ReadPartial = 16,
        WritePartial = 32,
        HasNonUniformType = 64,
        HasLiteralType = 128,
        ContainsPublic = 256,
        ContainsProtected = 512,
        ContainsPrivate = 1024,
        ContainsStatic = 2048,
        Late = 4096,
        ReverseMapped = 8192,
        OptionalParameter = 16384,
        RestParameter = 32768,
        DeferredType = 65536,
        HasNeverType = 131072,
        Mapped = 262144,
        StripOptional = 524288,
        Synthetic = 6,
        Discriminant = 192,
        Partial = 48
    }
}
