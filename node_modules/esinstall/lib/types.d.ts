export declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>;
};
export declare type EnvVarReplacements = Record<string, string | number | true>;
export interface ImportMap {
    imports: {
        [packageName: string]: string;
    };
}
export interface AbstractLogger {
    debug: (...args: any[]) => void;
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
/**
 * An install target represents information about a dependency to install.
 * The specifier is the key pointing to the dependency, either as a package
 * name or as an actual file path within node_modules. All other properties
 * are metadata about what is actually being imported.
 */
export declare type InstallTarget = {
    specifier: string;
    all: boolean;
    default: boolean;
    namespace: boolean;
    named: string[];
};
export declare type DependencyStats = {
    size: number;
    gzip: number;
    brotli?: number;
    delta?: number;
};
export declare type DependencyType = 'direct' | 'common';
export declare type DependencyStatsMap = {
    [filePath: string]: DependencyStats;
};
export declare type DependencyStatsOutput = Record<DependencyType, DependencyStatsMap>;
export declare type LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';
export declare type LoggerEvent = 'debug' | 'info' | 'warn' | 'error';
export interface LoggerOptions {
    /** (optional) change name at beginning of line */
    name?: string;
}
export declare type ExportMapEntry = string | {
    browser?: ExportMapEntry;
    import?: ExportMapEntry;
    default?: ExportMapEntry;
    require?: ExportMapEntry;
};
export declare type ExportMap = Record<string, ExportMapEntry>;
export declare type ExportField = string | ExportMap;
/**
 * https://github.com/defunctzombie/package-browser-field-spec
 * "browser": "main.js",
 * "browser": { "./": "main.js" }
 * "browser": { "./foo": false } // don't include in bundle
 */
export declare type BrowserField = string | Record<string, string | boolean>;
export declare type PackageManifest = {
    name: string;
    version: string;
    main?: string;
    module?: string;
    exports?: ExportField;
    browser?: BrowserField;
    types?: string;
    typings?: string;
};
export declare type PackageManifestWithExports = PackageManifest & {
    exports: ExportMap;
};
