import { Logger } from "./loggers";
/**
 * Loads a package.json and validates that it is a JSON Object
 */
export declare function loadPackageManifest(logger: Logger, packageJsonPath: string): Record<string, unknown> | undefined;
/**
 * Given a list of (potentially wildcarded) package paths,
 * return all the actual package folders found.
 */
export declare function expandPackages(logger: Logger, packageJsonDir: string, workspaces: string[]): string[];
export declare const ignorePackage: unique symbol;
/**
 * Given a package.json, attempt to find the TS file that defines its entry point
 * The JS must be built with sourcemaps.
 *
 * When the TS file cannot be determined, the intention is to
 * - Ignore things which don't appear to be `require`-able node packages.
 * - Fail on things which appear to be `require`-able node packages but are missing
 *   the necessary metadata for us to document.
 */
export declare function getTsEntryPointForPackage(logger: Logger, packageJsonPath: string, packageJson: Record<string, unknown>): string | undefined | typeof ignorePackage;
