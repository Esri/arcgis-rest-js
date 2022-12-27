import WebSocket from 'ws';
import stripAnsi from 'strip-ansi';
import { logger } from './logger';
const DEFAULT_CONNECT_DELAY = 2000;
const DEFAULT_PORT = 12321;
export class EsmHmrEngine {
    constructor(options) {
        this.clients = new Set();
        this.dependencyTree = new Map();
        this.delay = 0;
        this.currentBatch = [];
        this.currentBatchTimeout = null;
        this.cachedConnectErrors = new Set();
        this.port = 0;
        this.port = options.port || DEFAULT_PORT;
        const wss = (this.wss = options.server
            ? new WebSocket.Server({ noServer: true })
            : new WebSocket.Server({ port: this.port }));
        if (options.delay) {
            this.delay = options.delay;
        }
        if (options.server) {
            options.server.on('upgrade', (req, socket, head) => {
                // Only handle upgrades to ESM-HMR requests, ignore others.
                if (req.headers['sec-websocket-protocol'] !== 'esm-hmr') {
                    return;
                }
                wss.handleUpgrade(req, socket, head, (client) => {
                    wss.emit('connection', client, req);
                });
            });
        }
        wss.on('connection', (client) => {
            this.connectClient(client);
            this.registerListener(client);
            if (this.cachedConnectErrors.size > 0) {
                this.dispatchMessage(Array.from(this.cachedConnectErrors), client);
            }
        });
        wss.on('close', (client) => {
            if (client) {
                this.disconnectClient(client);
            }
        });
    }
    registerListener(client) {
        client.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === 'hotAccept') {
                    const entry = this.getEntry(message.id, true);
                    entry.isHmrAccepted = true;
                    entry.isHmrEnabled = true;
                }
            }
            catch (error) {
                logger.error(error.toString());
            }
        });
    }
    createEntry(sourceUrl) {
        const newEntry = {
            dependencies: new Set(),
            dependents: new Set(),
            needsReplacement: false,
            needsReplacementCount: 0,
            isHmrEnabled: false,
            isHmrAccepted: false,
        };
        this.dependencyTree.set(sourceUrl, newEntry);
        return newEntry;
    }
    getEntry(sourceUrl, createIfNotFound = false) {
        const result = this.dependencyTree.get(sourceUrl);
        if (result) {
            return result;
        }
        if (createIfNotFound) {
            return this.createEntry(sourceUrl);
        }
        return null;
    }
    setEntry(sourceUrl, imports, isHmrEnabled = false) {
        const result = this.getEntry(sourceUrl, true);
        const outdatedDependencies = new Set(result.dependencies);
        result.isHmrEnabled = isHmrEnabled;
        for (const importUrl of imports) {
            this.addRelationship(sourceUrl, importUrl);
            outdatedDependencies.delete(importUrl);
        }
        for (const importUrl of outdatedDependencies) {
            this.removeRelationship(sourceUrl, importUrl);
        }
    }
    removeRelationship(sourceUrl, importUrl) {
        let importResult = this.getEntry(importUrl);
        importResult && importResult.dependents.delete(sourceUrl);
        const sourceResult = this.getEntry(sourceUrl);
        sourceResult && sourceResult.dependencies.delete(importUrl);
    }
    addRelationship(sourceUrl, importUrl) {
        if (importUrl !== sourceUrl) {
            let importResult = this.getEntry(importUrl, true);
            importResult.dependents.add(sourceUrl);
            const sourceResult = this.getEntry(sourceUrl, true);
            sourceResult.dependencies.add(importUrl);
        }
    }
    markEntryForReplacement(entry, state) {
        if (state) {
            entry.needsReplacementCount++;
        }
        else {
            entry.needsReplacementCount--;
        }
        entry.needsReplacement = !!entry.needsReplacementCount;
    }
    broadcastMessage(data) {
        // Special "error" event handling
        if (data.type === 'error') {
            // Clean: remove any console styling before we send to the browser
            // NOTE(@fks): If another event ever needs this, okay to generalize.
            data.title = data.title && stripAnsi(data.title);
            data.errorMessage = data.errorMessage && stripAnsi(data.errorMessage);
            data.fileLoc = data.fileLoc && stripAnsi(data.fileLoc);
            data.errorStackTrace = data.errorStackTrace && stripAnsi(data.errorStackTrace);
            // Cache: Cache errors in case an HMR client connects after the error (first page load).
            if (Array.from(this.cachedConnectErrors).every((f) => JSON.stringify(f) !== JSON.stringify(data))) {
                this.cachedConnectErrors.add(data);
                setTimeout(() => {
                    this.cachedConnectErrors.delete(data);
                }, DEFAULT_CONNECT_DELAY);
            }
        }
        if (this.delay > 0) {
            if (this.currentBatchTimeout) {
                clearTimeout(this.currentBatchTimeout);
            }
            this.currentBatch.push(data);
            this.currentBatchTimeout = setTimeout(() => this.dispatchBatch(), this.delay || 100);
        }
        else {
            this.dispatchMessage([data]);
        }
    }
    dispatchBatch() {
        if (this.currentBatchTimeout) {
            clearTimeout(this.currentBatchTimeout);
        }
        if (this.currentBatch.length > 0) {
            this.dispatchMessage(this.currentBatch);
            this.currentBatch = [];
        }
    }
    /**
     * This is shared logic to dispatch messages to the clients. The public methods
     * `broadcastMessage` and `dispatchBatch` manage the delay then use this,
     * internally when it's time to actually send the data.
     */
    dispatchMessage(messageBatch, singleClient) {
        if (messageBatch.length === 0) {
            return;
        }
        const clientRecipientList = singleClient ? [singleClient] : this.clients;
        let singleSummaryMessage = messageBatch.find((message) => message.type === 'reload') || null;
        clientRecipientList.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (singleSummaryMessage) {
                    client.send(JSON.stringify(singleSummaryMessage));
                }
                else {
                    messageBatch.forEach((data) => {
                        client.send(JSON.stringify(data));
                    });
                }
            }
            else {
                this.disconnectClient(client);
            }
        });
    }
    connectClient(client) {
        this.clients.add(client);
    }
    disconnectClient(client) {
        client.terminate();
        this.clients.delete(client);
    }
    disconnectAllClients() {
        for (const client of this.clients) {
            this.disconnectClient(client);
        }
    }
    stop() {
        // This will disconnect clients so no need to do that ourselves.
        return new Promise((resolve, reject) => {
            this.wss.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(void 0);
                }
            });
        });
    }
}
