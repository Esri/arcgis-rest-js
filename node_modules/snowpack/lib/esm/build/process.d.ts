import type { ImportMap, InstallTarget } from 'esinstall';
import type { CommandOptions, SnowpackConfig, SnowpackDevServer } from '../types';
interface BuildState {
    commandOptions: CommandOptions;
    config: SnowpackConfig;
    isWatch: boolean;
    isDev: boolean;
    isSSR: boolean;
    isHMR: boolean;
    clean: boolean;
    allBareModuleSpecifiers: InstallTarget[];
    allFileUrlsUnique: Set<string>;
    allFileUrlsToProcess: string[];
    buildDirectoryLoc: string;
    devServer: SnowpackDevServer;
    optimizedImportMap?: ImportMap;
}
export declare function createBuildState(commandOptions: CommandOptions): Promise<BuildState>;
export declare function maybeCleanBuildDirectory(state: BuildState): void;
export declare function addBuildFiles(state: BuildState, files: string[]): Promise<void>;
export declare function addBuildFilesFromMountpoints(state: BuildState): Promise<void>;
export declare function buildFiles(state: BuildState): Promise<void>;
export declare function buildDependencies(state: BuildState): Promise<void>;
export declare function writeToDisk(state: BuildState): Promise<void>;
export declare function startWatch(state: BuildState): Promise<{
    onFileChange: (callback: any) => any;
    shutdown(): Promise<void>;
}>;
export declare function optimize(state: BuildState): Promise<void>;
export declare function postBuildCleanup(state: BuildState): Promise<void>;
export {};
