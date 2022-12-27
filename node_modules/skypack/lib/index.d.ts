/// <reference types="node" />
import { IncomingHttpHeaders } from 'http';
import { ImportMap } from './util';
export { rollupPluginSkypack } from './rollup-plugin-remote-cdn';
export declare const SKYPACK_ORIGIN = "https://cdn.skypack.dev";
export declare class SkypackSDK {
    origin: string;
    constructor(options?: {
        origin?: string;
    });
    generateImportMap(webDependencies: Record<string, string | null>, inheritFromImportMap?: ImportMap): Promise<ImportMap>;
    fetch(resourceUrl: string, userAgent?: string): Promise<{
        body: Buffer;
        headers: IncomingHttpHeaders;
        statusCode: number;
        isCached: boolean;
        isStale: boolean;
    }>;
    buildNewPackage(spec: string, semverString?: string, userAgent?: string): Promise<BuildNewPackageResponse>;
    lookupBySpecifier(spec: string, semverString?: string, qs?: string, userAgent?: string): Promise<LookupBySpecifierResponse>;
    installTypes(spec: string, semverString?: string, dir?: string): Promise<void>;
}
export declare type BuildNewPackageResponse = {
    error: Error;
    success: false;
} | {
    error: null;
    success: boolean;
};
export declare type LookupBySpecifierResponse = {
    error: Error;
} | {
    error: null;
    body: Buffer;
    isCached: boolean;
    isStale: boolean;
    importStatus: string;
    importUrl: string;
    pinnedUrl: string | undefined;
    typesUrl: string | undefined;
};
export declare function clearCache(): Promise<void>;
