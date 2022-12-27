import { Spinner } from "./spinner";
import { RunnerOptions } from "./options";
export declare class CommandFormatter {
    cmd: string;
    level: number;
    spinner: Spinner | undefined;
    options: RunnerOptions;
    packageName?: string | undefined;
    output: string;
    constructor(cmd: string, level: number, spinner: Spinner | undefined, options: RunnerOptions, packageName?: string | undefined);
    private format;
    write(data: string): void;
}
