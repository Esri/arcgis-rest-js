import { Workspace } from "./workspace";
export declare enum ChangeType {
    added = 0,
    deleted = 1,
    modified = 2
}
export declare type Change = {
    file: string;
    type: ChangeType;
};
export declare function needsBuild(root: string, workspace: Workspace | undefined, forceRebuild?: boolean): Promise<{
    isGitRepo: boolean;
    changes: Change[];
    onBuild: () => Promise<void>;
} | undefined>;
