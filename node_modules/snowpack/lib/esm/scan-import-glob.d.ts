export interface ImportGlobStatement {
    start: number;
    end: number;
    glob: string;
    isEager: boolean;
}
export declare function scanImportGlob(code: string): ImportGlobStatement[];
