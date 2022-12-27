export declare enum WorkspaceProviderType {
    single = "single",
    lerna = "lerna",
    yarn = "yarn",
    pnpm = "pnpm",
    rush = "rush",
    recursive = "recursive"
}
declare type WorkspaceProviderInfo = {
    root: string;
    patterns: string[];
} | undefined;
declare type WorkspaceProvider = (cwd: string) => WorkspaceProviderInfo | Promise<WorkspaceProviderInfo>;
export declare const providers: Record<WorkspaceProviderType, WorkspaceProvider>;
export {};
