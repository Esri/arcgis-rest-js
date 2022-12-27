export declare function scanCodeImportsExports(code: string): Promise<any[]>;
export declare function transformEsmImports(_code: string, replaceImport: (specifier: string) => string | Promise<string>): Promise<string>;
export declare function transformFileImports({ type, contents }: {
    type: string;
    contents: string;
}, replaceImport: (specifier: string) => string | Promise<string>): Promise<string>;
export declare function transformAddMissingDefaultExport(_code: string): Promise<string>;
