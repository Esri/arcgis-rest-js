export interface AbstractLogger {
    debug: (...args: any[]) => void;
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
export interface ImportMap {
    imports: {
        [packageName: string]: string;
    };
}
export declare const GLOBAL_CACHE_DIR: any;
export declare const RESOURCE_CACHE: string;
export declare const HAS_CDN_HASH_REGEX: RegExp;
export declare const BUILD_CACHE: string;
export declare const HTML_JS_REGEX: RegExp;
export declare const CSS_REGEX: RegExp;
export declare const SVELTE_VUE_REGEX: RegExp;
export declare const URL_HAS_PROTOCOL_REGEX: RegExp;
export declare function getEncodingType(ext: string): 'utf-8' | undefined;
export declare function readLockfile(cwd: string): Promise<ImportMap | null>;
export declare function writeLockfile(loc: string, importMap: ImportMap): Promise<void>;
export declare function isTruthy<T>(item: T | false | null | undefined): item is T;
/** Get the package name + an entrypoint within that package (if given). */
export declare function parsePackageImportSpecifier(imp: string): [string, string | null];
/**
 * Given a package name, look for that package's package.json manifest.
 * Return both the manifest location (if believed to exist) and the
 * manifest itself (if found).
 *
 * NOTE: You used to be able to require() a package.json file directly,
 * but now with export map support in Node v13 that's no longer possible.
 */
export declare function resolveDependencyManifest(dep: string, cwd: string): [string | null, any | null];
/**
 * If Rollup erred parsing a particular file, show suggestions based on its
 * file extension (note: lowercase is fine).
 */
export declare const MISSING_PLUGIN_SUGGESTIONS: {
    [ext: string]: string;
};
export declare function checkLockfileHash(dir: string): Promise<boolean>;
export declare function updateLockfileHash(dir: string): Promise<void>;
/**
 * For the given import specifier, return an alias entry if one is matched.
 */
export declare function findMatchingAliasEntry(alias: Record<string, string>, spec: string): {
    from: string;
    to: string;
    type: 'package' | 'path';
} | undefined;
/**
 * For the given import specifier, return an alias entry if one is matched.
 */
export declare function isPackageAliasEntry(val: string): boolean;
/** Get full extensions of files */
export declare function getExt(fileName: string): {
    /** base extension (e.g. `.js`) */
    baseExt: string;
    /** full extension, if applicable (e.g. `.proxy.js`) */
    expandedExt: string;
};
/** Replace file extensions */
export declare function replaceExt(fileName: string, oldExt: string, newExt: string): string;
/**
 * Sanitizes npm packages that end in .js (e.g `tippy.js` -> `tippyjs`).
 * This is necessary because Snowpack can’t create both a file and directory
 * that end in .js.
 */
export declare function sanitizePackageName(filepath: string): string;
/** CSS sourceMappingURL */
export declare function cssSourceMappingURL(code: string, sourceMappingURL: string): string;
/** JS sourceMappingURL */
export declare function jsSourceMappingURL(code: string, sourceMappingURL: string): string;
export declare function removeLeadingSlash(path: string): string;
export declare function removeTrailingSlash(path: string): string;
export declare function addLeadingSlash(path: string): string;
export declare function addTrailingSlash(path: string): string;
