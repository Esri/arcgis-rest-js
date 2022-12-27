import { CommandFormatter } from "./formatter";
import { RunnerOptions } from "./options";
import { PackageJson } from "./package";
import { Command } from "./parser";
import { OutputSpinner, Spinner } from "./spinner";
import { Workspace } from "./workspace";
export declare class Runner {
    _options: Partial<RunnerOptions>;
    spinner: OutputSpinner;
    options: RunnerOptions;
    workspace?: Workspace;
    buildCmd: string;
    constructor(_options?: Partial<RunnerOptions>);
    formatStart(cmd: Command, level: number, parentSpinner?: Spinner): Spinner | undefined;
    runCommand(cmd: Command, level?: number, parentSpinner?: Spinner): Promise<void>;
    formatCommand(cmd: Command): string;
    private pnpFile;
    findPnpJsFile(cwd?: string): string | undefined;
    spawn(cmd: string, args: string[], formatter: CommandFormatter, cwd?: string, env?: Record<string, string>): Promise<void>;
    formatDuration(duration: number): string;
    list(): Promise<void>;
    run(cmd: string, pkg?: PackageJson): Promise<void>;
    info(): Promise<void>;
    deps: Map<string | undefined, Promise<void>>;
    runRecursive(cmd: string): Promise<void>;
    _run(command: Command, level?: number): Promise<void>;
}
