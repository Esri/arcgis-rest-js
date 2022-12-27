/// <reference types="node" />
import type http from 'http';
import type http2 from 'http2';
import { FileBuilder } from '../build/file-builder';
import { EsmHmrEngine } from '../hmr-server-engine';
import { SnowpackConfig } from '../types';
export declare function startHmrEngine(inMemoryBuildCache: Map<string, FileBuilder>, server: http.Server | http2.Http2Server | undefined, serverPort: number | undefined, config: SnowpackConfig): {
    hmrEngine: EsmHmrEngine;
    handleHmrUpdate: (fileLoc: string, originalUrl: string) => void;
};
