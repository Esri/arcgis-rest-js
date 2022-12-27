import { CommandOptions, SnowpackDevServer } from '../types';
export declare class OneToManyMap {
    readonly keyToValue: Map<string, string[]>;
    readonly valueToKey: Map<string, string>;
    add(key: string, _value: string | string[]): void;
    delete(key: string): void;
    key(value: string): string | undefined;
    value(key: string): string[] | undefined;
}
/**
 * A helper class for "Not Found" errors, storing data about what file lookups were attempted.
 */
export declare class NotFoundError extends Error {
    constructor(url: string, lookups?: string[]);
}
export declare function startServer(commandOptions: CommandOptions, { isDev: _isDev, isWatch: _isWatch, preparePackages: _preparePackages, }?: {
    isDev?: boolean;
    isWatch?: boolean;
    preparePackages?: boolean;
}): Promise<SnowpackDevServer>;
export declare function command(commandOptions: CommandOptions): Promise<unknown>;
