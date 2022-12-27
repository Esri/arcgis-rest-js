import { InstallTarget, ImportMap, PackageManifest } from './types';
export declare const NATIVE_REQUIRE: any;
export declare function writeLockfile(loc: string, importMap: ImportMap): Promise<void>;
export declare function isRemoteUrl(val: string): boolean;
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
export declare function resolveDependencyManifest(dep: string, cwd: string): [string | null, PackageManifest | null];
/**
 * If Rollup erred parsing a particular file, show suggestions based on its
 * file extension (note: lowercase is fine).
 */
export declare const MISSING_PLUGIN_SUGGESTIONS: {
    [ext: string]: string;
};
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
/**
 * Sanitizes npm packages that end in .js (e.g `tippy.js` -> `tippyjs`).
 * This is necessary because Snowpack can’t create both a file and directory
 * that end in .js.
 */
export declare function sanitizePackageName(filepath: string): string;
/**
 * Formats the snowpack dependency name from a "webDependencies" input value:
 * 2. Remove any ".js"/".mjs" extension (will be added automatically by Rollup)
 */
export declare function getWebDependencyName(dep: string): string;
/** Add / to beginning of string (but don’t double-up) */
export declare function addLeadingSlash(path: string): string;
/** Add / to the end of string (but don’t double-up) */
export declare function addTrailingSlash(path: string): string;
/** Remove \ and / from beginning of string */
export declare function removeLeadingSlash(path: string): string;
/** Remove \ and / from end of string */
export declare function removeTrailingSlash(path: string): string;
export declare function createInstallTarget(specifier: string, all?: boolean): InstallTarget;
export declare function isJavaScript(pathname: string): boolean;
export declare function getWebDependencyType(pathname: string): 'ASSET' | 'BUNDLE' | 'DTS';
