import { Plugin as RollupPlugin } from 'rollup';
import { AbstractLogger, DependencyStatsOutput, EnvVarReplacements, ImportMap, InstallTarget } from './types';
export * from './types';
export { findExportMapEntry, findManifestEntry, resolveEntrypoint, explodeExportMap, } from './entrypoints';
export { resolveDependencyManifest } from './util';
export { printStats } from './stats';
interface InstallOptions {
    cwd: string;
    stats: boolean;
    alias: Record<string, string>;
    importMap?: ImportMap;
    logger: AbstractLogger;
    verbose?: boolean;
    dest: string;
    env: EnvVarReplacements;
    treeshake?: boolean;
    polyfillNode: boolean;
    sourcemap?: boolean | 'inline';
    external: string[];
    externalEsm: boolean | string[] | ((imp: string) => boolean);
    packageLookupFields: string[];
    packageExportLookupFields: string[];
    namedExports: string[];
    rollup: {
        context?: string;
        plugins?: RollupPlugin[];
        dedupe?: string[];
    };
}
declare type PublicInstallOptions = Partial<InstallOptions>;
export { PublicInstallOptions as InstallOptions };
export declare type InstallResult = {
    importMap: ImportMap;
    stats: DependencyStatsOutput | null;
};
export declare function install(_installTargets: (InstallTarget | string)[], _options?: PublicInstallOptions): Promise<InstallResult>;
