import { RunnerOptions } from "./options";
import { Command } from "./parser";
import { Workspace } from "./workspace";
export declare function createCommand(workspace: Workspace, cmd: string, options: RunnerOptions): Command;
