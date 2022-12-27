import { ExportField, ExportMapEntry, PackageManifest } from './types';
export declare const MAIN_FIELDS: string[];
declare type FindManifestEntryOptions = {
    packageLookupFields?: string[];
    packageName?: string;
};
/**
 *
 */
export declare function findManifestEntry(manifest: PackageManifest, entry?: string, { packageLookupFields, packageName }?: FindManifestEntryOptions): string | undefined;
/**
 * Given an ExportMapEntry find the entry point, resolving recursively.
 */
export declare function findExportMapEntry(exportMapEntry?: ExportMapEntry, conditions?: string[]): string | undefined;
declare type ResolveEntrypointOptions = {
    cwd: string;
    packageLookupFields: string[];
};
/**
 * Resolve a "webDependencies" input value to the correct absolute file location.
 * Supports both npm package names, and file paths relative to the node_modules directory.
 * Follows logic similar to Node's resolution logic, but using a package.json's ESM "module"
 * field instead of the CJS "main" field.
 */
export declare function resolveEntrypoint(dep: string, { cwd, packageLookupFields }: ResolveEntrypointOptions): string;
/**
 * Given an export map and all of the crazy variations, condense down to a key/value map of string keys to string values.
 */
export declare function explodeExportMap(exportField: ExportField | undefined, { cwd }: {
    cwd: string;
}): Record<string, string> | undefined;
export {};
