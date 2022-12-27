import { MountEntry, SnowpackConfig } from '../types';
/**
 * Map a file path to the hosted URL for a given "mount" entry.
 */
export declare function getUrlsForFileMount({ fileLoc, mountKey, mountEntry, config, }: {
    fileLoc: string;
    mountKey: string;
    mountEntry: MountEntry;
    config: SnowpackConfig;
}): string[];
/**
 * Map a file path to the hosted URL for a given "mount" entry.
 */
export declare function getBuiltFileUrls(filepath: string, config: SnowpackConfig): string[];
/**
 * Get the final, hosted URL path for a given file on disk.
 */
export declare function getMountEntryForFile(fileLoc: string, config: SnowpackConfig): [string, MountEntry] | null;
/**
 * Get the final, hosted URL path for a given file on disk.
 */
export declare function getUrlsForFile(fileLoc: string, config: SnowpackConfig): undefined | string[];
