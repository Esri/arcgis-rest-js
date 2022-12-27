/// <reference types="node" />
import { Terminal } from "./terminal";
export declare enum SpinnerResult {
    success = 1,
    error = 2,
    warning = 3
}
export declare class Spinner {
    text: string;
    level: number;
    result?: SpinnerResult;
    start: number;
    stop?: number;
    output: string;
    constructor(text: string, level?: number);
    format(symbol: string): string;
}
export declare class OutputSpinner {
    stream: NodeJS.WriteStream & {
        fd: 1;
    };
    spinner: {
        interval: number;
        frames: string[];
    };
    frame: number;
    interval: NodeJS.Timeout | undefined;
    running: boolean;
    spinnerMap: Map<Spinner | undefined, Spinner[]>;
    terminal: Terminal;
    constructor(stream?: NodeJS.WriteStream & {
        fd: 1;
    });
    render(full?: boolean): void;
    get spinners(): Spinner[];
    start(text: string, level?: number, parentSpinner?: Spinner): Spinner;
    stop(spinner: Spinner): void;
    error(spinner: Spinner): void;
    warning(spinner: Spinner): void;
    success(spinner: Spinner): void;
    _start(): void;
    _stop(): void;
}
