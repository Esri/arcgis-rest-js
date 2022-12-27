import Arborist from '@npmcli/arborist';
import { InstallTarget } from 'esinstall';
import { ImportMap, PackageSource, SnowpackConfig } from '../types';
declare type PackageImportData = {
    entrypoint: string;
    loc: string;
    installDest: string;
    packageVersion: string;
    packageName: string;
};
export declare class PackageSourceLocal implements PackageSource {
    config: SnowpackConfig;
    arb: Arborist;
    npmConnectionOptions: object;
    cacheDirectory: string;
    packageSourceDirectory: string;
    memoizedResolve: Record<string, string>;
    memoizedImportMap: Record<string, ImportMap>;
    allPackageImports: Record<string, PackageImportData>;
    allSymlinkImports: Record<string, string>;
    allKnownSpecs: Set<string>;
    allKnownProjectSpecs: Set<string>;
    hasWorkspaceWarningFired: boolean;
    constructor(config: SnowpackConfig);
    private setupCacheDirectory;
    private setupPackageRootDirectory;
    prepare(): Promise<void>;
    prepareSingleFile(fileLoc: string): Promise<void>;
    load(id: string, { isSSR }?: {
        isSSR?: boolean;
    }): Promise<{
        contents: string;
        imports: InstallTarget[];
    } | undefined>;
    modifyBuildInstallOptions(installOptions: any, installTargets: any): Promise<any>;
    private resolveArbNode;
    private installPackage;
    private buildPackageImport;
    resolvePackageImport(_spec: string, options?: {
        source?: string;
        importMap?: ImportMap;
        isRetry?: boolean;
    }): any;
    clearCache(): void;
    getCacheFolder(): string;
    private isExternal;
}
export {};
