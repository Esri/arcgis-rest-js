import { InstallOptions as EsinstallOptions, InstallTarget } from 'esinstall';
import { ImportMap, SnowpackConfig } from '../types';
interface InstallOptions {
    config: SnowpackConfig;
    isDev: boolean;
    isSSR: boolean;
    installOptions: EsinstallOptions;
    installTargets: (InstallTarget | string)[];
}
interface InstallResult {
    importMap: ImportMap;
    needsSsrBuild: boolean;
}
export declare function installPackages({ config, isDev, isSSR, installOptions, installTargets, }: InstallOptions): Promise<InstallResult>;
export {};
