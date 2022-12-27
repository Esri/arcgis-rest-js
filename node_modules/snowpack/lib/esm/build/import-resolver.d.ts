/// <reference types="node" />
import fs from 'fs';
import { SnowpackConfig } from '../types';
/** Perform a file disk lookup for the requested import specifier. */
export declare function getFsStat(importedFileOnDisk: string): fs.Stats | false;
/**
 * Create a import resolver function, which converts any import relative to the given file at "fileLoc"
 * to a proper URL. Returns false if no matching import was found, which usually indicates a package
 * not found in the import map.
 */
export declare function createImportResolver({ fileLoc, config }: {
    fileLoc: string;
    config: SnowpackConfig;
}): (spec: string) => string | false;
/**
 * Create a import glob resolver function, which converts any import globs relative to the given file at "fileLoc"
 * to a local file. These will additionally be transformed by the regular import resolver, so they do not need
 * to be finalized just yet
 */
export declare function createImportGlobResolver({ fileLoc, config, }: {
    fileLoc: string;
    config: SnowpackConfig;
}): (spec: string) => Promise<string[]>;
