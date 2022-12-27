import { PackageJson } from "./package";
export declare enum CommandType {
    script = "script",
    bin = "bin",
    system = "system",
    op = "op",
    unknown = "unknown"
}
declare type DebugCommand = string | {
    [cmd: string]: DebugCommand;
} | DebugCommand[];
export declare class Command {
    args: string[];
    type: CommandType;
    bin?: string | undefined;
    env: Record<string, string>;
    name: string;
    children: Command[];
    concurrent: boolean;
    cwd?: string;
    packageName?: string;
    beforeRun: () => Promise<void>;
    afterRun: () => void;
    constructor(args: string[], type: CommandType, bin?: string | undefined, env?: Record<string, string>);
    add(...children: Command[]): this;
    setCwd(cwd: string): this;
    setPackageName(name: string): this;
    debug(showConcurrent?: boolean): DebugCommand;
    isPreScript(): boolean;
    isPostScript(): boolean;
}
export declare class CommandParser {
    pkg: PackageJson;
    ops: string[];
    hooks: [string[], string[]][];
    binPath: string[];
    binsPnp: Map<string, string>;
    constructor(pkg: PackageJson, cwd?: string);
    parseArgs(cmd: string): string[];
    createScript(name: string, args?: string[], env?: Record<string, string>): Command;
    createCommand(cmd: string[], allowScriptCmd: boolean, env: Record<string, string>): Command;
    parseEnvVar(arg: string): [string, string] | undefined;
    isEnvVar(arg: string): boolean;
    createGroup(cmd: string, allowScriptCmd?: boolean): Command;
    parse(cmd: string): Command;
    isScript(name: string): boolean | undefined;
    private getBin;
    private isBin;
    getScript(name: string): string | undefined;
}
export {};
