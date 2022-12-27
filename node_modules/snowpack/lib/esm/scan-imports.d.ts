import { ImportSpecifier } from 'es-module-lexer';
import { InstallTarget } from 'esinstall';
import { SnowpackConfig, SnowpackSourceFile } from './types';
export declare function getInstallTargets(config: SnowpackConfig, knownEntrypoints: string[], scannedFiles?: SnowpackSourceFile[]): Promise<InstallTarget[]>;
export declare function matchDynamicImportValue(importStatement: string): any;
export declare function getWebModuleSpecifierFromCode(code: string, imp: ImportSpecifier): string | null;
export declare function scanDepList(depList: string[], cwd: string): InstallTarget[];
export declare function scanImports(includeTests: boolean, config: SnowpackConfig): Promise<InstallTarget[]>;
export declare function scanImportsFromFiles(loadedFiles: SnowpackSourceFile[], config: SnowpackConfig): Promise<InstallTarget[]>;
