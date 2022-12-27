/// <reference types="node" />
import { InstallTarget } from 'esinstall';
import { EsmHmrEngine } from '../hmr-server-engine';
import { ImportMap, SnowpackBuildMap, SnowpackBuildResultFileManifest, SnowpackConfig } from '../types';
/**
 * FileBuilder - This class is responsible for building a file. It is broken into
 * individual stages so that the entire application build process can be tackled
 * in stages (build -> resolve -> get response).
 */
export declare class FileBuilder {
    buildOutput: SnowpackBuildMap;
    resolvedOutput: SnowpackBuildMap;
    isDev: boolean;
    isHMR: boolean;
    isSSR: boolean;
    buildPromise: Promise<SnowpackBuildMap> | undefined;
    readonly loc: string;
    readonly urls: string[];
    readonly config: SnowpackConfig;
    hmrEngine: EsmHmrEngine | null;
    constructor({ loc, isDev, isHMR, isSSR, config, hmrEngine, }: {
        loc: string;
        isDev: boolean;
        isHMR: boolean;
        isSSR: boolean;
        config: SnowpackConfig;
        hmrEngine?: EsmHmrEngine | null;
    });
    private verifyRequestFromBuild;
    /**
     * Resolve Imports: Resolved imports are based on the state of the file
     * system, so they can't be cached long-term with the build.
     */
    resolveImports(isResolve: boolean, hmrParam?: string | false, importMap?: ImportMap): Promise<InstallTarget[]>;
    /**
     * Given a file, build it. Building a file sends it through our internal
     * file builder pipeline, and outputs a build map representing the final
     * build. A Build Map is used because one source file can result in multiple
     * built files (Example: .svelte -> .js & .css).
     */
    build(isStatic: boolean): Promise<SnowpackBuildMap | undefined>;
    private finalizeResult;
    getResult(type: string): string | Buffer | undefined;
    getSourceMap(type: string): string | undefined;
    getProxy(_url: string, type: string): Promise<string>;
    writeToDisk(dir: string, results: SnowpackBuildResultFileManifest): Promise<void>;
}
