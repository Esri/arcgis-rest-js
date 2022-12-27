import { SnowpackBuildMap, SnowpackConfig } from '../types';
export interface BuildFileOptions {
    isDev: boolean;
    isSSR: boolean;
    isPackage: boolean;
    isHmrEnabled: boolean;
    config: SnowpackConfig;
}
export declare function runPipelineOptimizeStep(buildDirectory: string, { config }: {
    config: SnowpackConfig;
}): Promise<null>;
export declare function runPipelineCleanupStep({ plugins }: SnowpackConfig): Promise<void>;
/** Core Snowpack file pipeline builder */
export declare function buildFile(srcURL: URL, buildFileOptions: BuildFileOptions): Promise<SnowpackBuildMap>;
