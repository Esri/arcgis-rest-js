/// <reference types="node" />
import { EventEmitter } from 'events';
import { SnowpackConfig } from '../types';
export declare const paintEvent: {
    BUILD_FILE: string;
    LOAD_ERROR: string;
    SERVER_START: string;
    WORKER_COMPLETE: string;
    WORKER_MSG: string;
    WORKER_RESET: string;
};
/**
 * Get the actual port, based on the `defaultPort`.
 * If the default port was not available, then we'll prompt the user if its okay
 * to use the next available port.
 */
export declare function getPort(defaultPort: number): Promise<number>;
export declare function startDashboard(bus: EventEmitter, _config: SnowpackConfig): void;
