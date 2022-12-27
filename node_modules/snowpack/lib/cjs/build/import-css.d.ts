/** Generate CSS Modules for a given URL */
export declare function cssModules({ contents, url, }: {
    contents: string;
    url: string;
}): Promise<{
    css: string;
    json: Record<string, string>;
}>;
/** Return CSS Modules JSON from URL */
export declare function cssModuleJSON(url: string): string;
/** Should this file get CSS Modules? */
export declare function needsCSSModules(url: string): boolean;
