import type { Application } from "../application";
export declare function loadPlugins(app: Application, plugins: readonly string[]): void;
export declare function discoverNpmPlugins(app: Application): string[];
