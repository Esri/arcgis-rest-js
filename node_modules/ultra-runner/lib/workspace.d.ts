import { PackageJsonWithRoot } from "./package";
import { WorkspaceProviderType } from "./workspace.providers";
declare const defaultOptions: {
    cwd: string;
    type: WorkspaceProviderType | undefined;
    includeRoot: boolean;
};
export declare type WorkspaceOptions = typeof defaultOptions;
export declare class Workspace {
    root: string;
    type: WorkspaceProviderType;
    packages: Map<string, PackageJsonWithRoot>;
    roots: Map<string, string>;
    order: string[];
    private constructor();
    getPackageManager(): string | undefined;
    static detectWorkspaceProviders(cwd?: string): Promise<WorkspaceProviderType[]>;
    static getWorkspace(_options?: Partial<WorkspaceOptions>): Promise<Workspace | undefined>;
    getPackageForRoot(root: string): string | undefined;
    getDeps(pkgName: string): string[];
    _getDepTree(pkgName: string, seen?: string[]): string[];
    getDepTree(pkgName: string): string[];
    getPackages(filter?: string): PackageJsonWithRoot[];
}
export declare function getWorkspace(options?: Partial<WorkspaceOptions>): Promise<Workspace | undefined>;
export {};
