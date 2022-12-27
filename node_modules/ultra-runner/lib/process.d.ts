/// <reference types="node" />
declare type ExitListener = (signal: NodeJS.Signals | "exit") => void;
export declare function onProcessExit(listener: ExitListener, forceExit?: boolean): void;
export {};
