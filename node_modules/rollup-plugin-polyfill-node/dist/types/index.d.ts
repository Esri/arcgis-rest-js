export interface NodePolyfillsOptions {
    baseDir?: string;
    sourceMap?: boolean;
    include?: Array<string | RegExp> | string | RegExp | null;
    exclude?: Array<string | RegExp> | string | RegExp | null;
}
export default function (opts?: NodePolyfillsOptions): {
    name: string;
    resolveId(importee: string, importer: string): {
        id: string;
        moduleSideEffects: boolean;
    } | null;
    load(id: string): any;
    transform(code: string, id: string): any;
};
