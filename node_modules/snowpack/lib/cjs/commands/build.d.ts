import type { CommandOptions, SnowpackBuildResult } from '../types';
export declare function build(commandOptions: CommandOptions): Promise<SnowpackBuildResult>;
export declare function command(commandOptions: CommandOptions): Promise<unknown>;
