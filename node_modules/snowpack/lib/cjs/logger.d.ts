import { LoggerLevel, LoggerEvent, LoggerOptions } from './types';
export interface LogRecord {
    val: string;
    count: number;
}
/** Custom logger heavily-inspired by https://github.com/pinojs/pino with extra features like log retentian */
declare class SnowpackLogger {
    /** set the log level (can be changed after init) */
    level: LoggerLevel;
    /** configure maximum number of logs to keep (default: 500) */
    logCount: number;
    private history;
    private callbacks;
    private log;
    /** emit messages only visible when --debug is passed */
    debug(message: string, options?: LoggerOptions): void;
    /** emit general info */
    info(message: string, options?: LoggerOptions): void;
    /** emit non-fatal warnings */
    warn(message: string, options?: LoggerOptions): void;
    /** emit critical error messages */
    error(message: string, options?: LoggerOptions): void;
    /** get full logging history */
    getHistory(): ReadonlyArray<LogRecord>;
    /** listen for events */
    on(event: LoggerEvent, callback: (message: string) => void): void;
}
/** export one logger to rest of app */
export declare const logger: SnowpackLogger;
export {};
