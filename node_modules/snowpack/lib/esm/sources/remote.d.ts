/// <reference types="node" />
import { SkypackSDK } from 'skypack';
import { LockfileManifest, PackageSource, SnowpackConfig } from '../types';
/**
 * Remote Package Source: A generic interface through which
 * Snowpack interacts with the Skypack CDN. Used to load dependencies
 * from the CDN during both development and optimized building.
 */
export declare class PackageSourceRemote implements PackageSource {
    config: SnowpackConfig;
    lockfile: LockfileManifest | null;
    remotePackageSDK: SkypackSDK;
    constructor(config: SnowpackConfig);
    prepare(): Promise<void>;
    prepareSingleFile(): Promise<void>;
    modifyBuildInstallOptions(installOptions: any): Promise<any>;
    load(spec: string): Promise<{
        contents: string;
        imports: never[];
    } | {
        contents: Buffer;
        imports: never[];
    }>;
    resolvePackageImport(spec: string): Promise<string>;
    static clearCache(): Promise<void>;
    /** @deprecated */
    clearCache(): Promise<void>;
    getCacheFolder(): string;
}
