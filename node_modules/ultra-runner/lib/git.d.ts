declare type GitFiles = Record<string, string>;
export declare class NoGitError extends Error {
}
export declare function parseFiles(data: string, root: string): GitFiles;
export declare function getGitFiles(root: string): Promise<GitFiles>;
declare class FilesCache {
    cache: Map<string, Record<string, string>>;
    clear(): void;
    getFiles(directory: string, exclude?: string[]): Promise<GitFiles>;
}
export declare const cache: FilesCache;
export {};
