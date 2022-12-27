import { PackageSource, SnowpackConfig } from '../types';
export declare const GLOBAL_CACHE_DIR: any;
export declare function clearCache(): Promise<[void, void, void]>;
export declare function getPackageSource(config: SnowpackConfig): PackageSource;
