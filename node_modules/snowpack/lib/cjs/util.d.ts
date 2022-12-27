/// <reference types="node" />
import type { ImportMap, LockfileManifest, SnowpackConfig } from './types';
import type { InstallTarget } from 'esinstall';
import { SkypackSDK } from 'skypack';
export declare const IS_DOTFILE_REGEX: RegExp;
export declare const LOCKFILE_NAME = "snowpack.deps.json";
export declare const NATIVE_REQUIRE: any;
export declare const REQUIRE_OR_IMPORT: (id: string, opts?: {
    from?: string;
}) => Promise<any>;
export declare function createRemotePackageSDK(config: SnowpackConfig): SkypackSDK;
export declare const BUILD_CACHE: string;
export declare const HTML_JS_REGEX: RegExp;
export declare const HTML_STYLE_REGEX: RegExp;
export declare const CSS_REGEX: RegExp;
export declare const SVELTE_VUE_REGEX: RegExp;
export declare const ASTRO_REGEX: RegExp;
export declare function getCacheKey(fileLoc: string, { isSSR, mode }: {
    isSSR: any;
    mode: any;
}): string;
export declare type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
/**
 * Like rimraf, but will fail if "dir" is outside of your configured build output directory.
 */
export declare function deleteFromBuildSafe(dir: string, config: SnowpackConfig): void;
/** Read file from disk; return a string if it’s a code file */
export declare function readFile(filepath: string): Promise<string | Buffer>;
export declare function readLockfile(cwd: string): Promise<LockfileManifest | null>;
export declare function createInstallTarget(specifier: string, all?: boolean): InstallTarget;
export declare function convertLockfileToSkypackImportMap(origin: string, lockfile: LockfileManifest): ImportMap;
export declare function convertSkypackImportMapToLockfile(dependencies: Record<string, string>, importMap: ImportMap): LockfileManifest;
export declare function writeLockfile(loc: string, importMap: LockfileManifest): Promise<void>;
export declare function isTruthy<T>(item: T | false | null | undefined): item is T;
/**
 * Returns true if fsevents exists. When Snowpack is bundled, automatic fsevents
 * detection fails for many libraries. This function helps add back support.
 */
export declare function isFsEventsEnabled(): boolean;
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
export declare function openInBrowser(protocol: string, hostname: string, port: number, browser: string, openUrl?: string): Promise<void>;
export declare function checkLockfileHash(dir: string): Promise<boolean>;
export declare function updateLockfileHash(dir: string): Promise<void>;
/**
 * For the given import specifier, return an alias entry if one is matched.
 */
export declare function findMatchingAliasEntry(config: SnowpackConfig, spec: string): {
    from: string;
    to: string;
    type: 'package' | 'path' | 'url';
} | undefined;
/**
 * Get the most specific file extension match possible.
 */
export declare function getExtensionMatch(fileName: string, extensionMap: Record<string, string[]>): [string, string[]] | undefined;
export declare function isPathImport(spec: string): boolean;
export declare function isRemoteUrl(val: string): boolean;
export declare function isImportOfPackage(importUrl: string, packageName: string): boolean;
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
/** URL relative */
export declare function relativeURL(path1: string, path2: string): string;
/** Append HTML before closing </head> tag */
export declare function appendHtmlToHead(doc: string, htmlToAdd: string): string;
export declare function isJavaScript(pathname: string): boolean;
export declare function getExtension(str: string): string;
export declare function hasExtension(str: string, ext: string): boolean;
export declare function replaceExtension(fileName: string, oldExt: string, newExt: string): string;
export declare function addExtension(fileName: string, newExt: string): string;
export declare function removeExtension(fileName: string, oldExt: string): string;
/** Add / to beginning of string (but don’t double-up) */
export declare function addLeadingSlash(path: string): string;
/** Add / to the end of string (but don’t double-up) */
export declare function addTrailingSlash(path: string): string;
/** Remove \ and / from beginning of string */
export declare function removeLeadingSlash(path: string): string;
/** Remove \ and / from end of string */
export declare function removeTrailingSlash(path: string): string;
/** It's `Array.splice`, but for Strings! */
export declare function spliceString(source: string, withSlice: string, start: number, end: number): string;
export declare const HMR_CLIENT_CODE: string;
export declare const HMR_OVERLAY_CODE: string;
export declare const INIT_TEMPLATE_FILE: string;
