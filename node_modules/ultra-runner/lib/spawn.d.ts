/// <reference types="node" />
import { ChildProcess } from "child_process";
export declare class Spawner {
    cmd: string;
    args: string[];
    cwd: string;
    env?: Record<string, string> | undefined;
    static children: Map<number, ChildProcess>;
    output: string;
    buffer: string;
    exitCode: number | undefined;
    onData: (data: string) => void;
    onLine: (line: string) => void;
    onError: (error: Error) => Error;
    onExit: (code: number) => Error;
    constructor(cmd: string, args?: string[], cwd?: string, env?: Record<string, string> | undefined);
    spawn(raw?: boolean): Promise<void>;
    static exit(_reason: string): void;
}
