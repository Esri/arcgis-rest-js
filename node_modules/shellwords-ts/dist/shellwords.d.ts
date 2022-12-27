export declare function split(line: string, callback?: (rawToken: string) => void): string[];
export declare function escape(raw: string): string;
export declare function join(strings: string[]): string;
declare class Shellwords {
    split: typeof split;
    escape: typeof escape;
    join: typeof join;
}
declare const _default: Shellwords;
export default _default;
