/// <reference types="node" />
import WebSocket from 'ws';
import type http from 'http';
import type http2 from 'http2';
interface Dependency {
    dependents: Set<string>;
    dependencies: Set<string>;
    isHmrEnabled: boolean;
    isHmrAccepted: boolean;
    needsReplacement: boolean;
    needsReplacementCount: number;
}
declare type HMRMessage = {
    type: 'reload';
} | {
    type: 'update';
    url: string;
    bubbled: boolean;
} | {
    type: 'error';
    title: string;
    errorMessage: string;
    fileLoc?: string;
    errorStackTrace?: string;
};
interface EsmHmrEngineOptions {
    server: http.Server | http2.Http2Server | undefined;
    port?: number | undefined;
    delay?: number;
}
export declare class EsmHmrEngine {
    clients: Set<WebSocket>;
    dependencyTree: Map<string, Dependency>;
    private delay;
    private currentBatch;
    private currentBatchTimeout;
    private cachedConnectErrors;
    readonly port: number;
    private wss;
    constructor(options: EsmHmrEngineOptions);
    registerListener(client: WebSocket): void;
    createEntry(sourceUrl: string): Dependency;
    getEntry(sourceUrl: string, createIfNotFound?: boolean): Dependency | null;
    setEntry(sourceUrl: string, imports: string[], isHmrEnabled?: boolean): void;
    removeRelationship(sourceUrl: string, importUrl: string): void;
    addRelationship(sourceUrl: string, importUrl: string): void;
    markEntryForReplacement(entry: Dependency, state: boolean): void;
    broadcastMessage(data: HMRMessage): void;
    dispatchBatch(): void;
    /**
     * This is shared logic to dispatch messages to the clients. The public methods
     * `broadcastMessage` and `dispatchBatch` manage the delay then use this,
     * internally when it's time to actually send the data.
     */
    private dispatchMessage;
    connectClient(client: WebSocket): void;
    disconnectClient(client: WebSocket): void;
    disconnectAllClients(): void;
    stop(): Promise<void>;
}
export {};
