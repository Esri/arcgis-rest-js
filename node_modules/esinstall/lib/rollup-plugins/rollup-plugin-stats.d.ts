import { Plugin } from 'rollup';
import { DependencyStatsOutput } from '../types';
export declare function rollupPluginDependencyStats(cb: (dependencyInfo: DependencyStatsOutput) => void): Plugin;
