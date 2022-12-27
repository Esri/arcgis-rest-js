import OnigString from './OnigString';
export interface IOnigCaptureIndex {
    index: number;
    start: number;
    end: number;
    length: number;
}
export interface IOnigMatch {
    index: number;
    captureIndices: IOnigCaptureIndex[];
    scanner: OnigScanner;
}
export declare class OnigScanner {
    private sources;
    /**
     * Create a new scanner with the given patterns
     * @param patterns  An array of string patterns
     */
    constructor(patterns: string[]);
    get patterns(): string[];
    /**
     * Find the next match from a given position
     * @param string The string to search
     * @param startPosition The optional position to start at, defaults to 0
     * @param callback The (error, match) function to call when done, match will null when there is no match
     */
    findNextMatch(string: string | OnigString, startPosition: number, callback: (err: any, match?: IOnigMatch) => void): void;
    /**
     * Find the next match from a given position
     * @param string The string to search
     * @param startPosition The optional position to start at, defaults to 0
     */
    findNextMatchSync(string: string | OnigString, startPosition: number): IOnigMatch;
    convertToString(value: any): any;
    convertToNumber(value: any): any;
}
export default OnigScanner;
