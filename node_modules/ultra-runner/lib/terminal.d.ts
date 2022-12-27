/// <reference types="node" />
export declare function showCursor(stream?: NodeJS.WriteStream): void;
export declare function hideCursor(stream?: NodeJS.WriteStream): void;
export declare class Terminal {
    stream: NodeJS.WriteStream & {
        fd: 1;
    };
    options: {
        clearScreen: boolean;
    };
    lines: string[];
    output: string;
    resized: boolean;
    constructor(stream?: NodeJS.WriteStream & {
        fd: 1;
    }, options?: {
        clearScreen: boolean;
    });
    clearScreen(): void;
    diff(from: string, to: string): {
        left: number;
        str: string;
    } | undefined;
    update(text: string | string[]): string | undefined;
}
