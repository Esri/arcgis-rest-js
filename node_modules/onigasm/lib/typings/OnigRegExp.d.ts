import { IOnigCaptureIndex } from './OnigScanner';
import OnigString from './OnigString';
export interface IOnigSearchResult extends IOnigCaptureIndex {
    match: string;
}
declare class OnigRegExp {
    private source;
    private scanner;
    /**
     * Create a new regex with the given pattern
     * @param source A string pattern
     */
    constructor(source: string);
    /**
     * Synchronously search the string for a match starting at the given position
     * @param string The string to search
     * @param startPosition The optional position to start the search at, defaults to `0`
     */
    searchSync(string: string | OnigString, startPosition?: number): IOnigSearchResult[];
    /**
     * Search the string for a match starting at the given position
     * @param string The string to search
     * @param startPosition The optional position to start the search at, defaults to `0`
     * @param callback The `(error, match)` function to call when done, match will be null if no matches were found. match will be an array of objects for each matched group on a successful search
     */
    search(string: string | OnigString, startPosition?: number, callback?: (error: any, match?: IOnigSearchResult[]) => void): void;
    /**
     * Synchronously test if this regular expression matches the given string
     * @param string The string to test against
     */
    testSync(string: string | OnigString): boolean;
    /**
     * Test if this regular expression matches the given string
     * @param string The string to test against
     * @param callback The (error, matches) function to call when done, matches will be true if at least one match is found, false otherwise
     */
    test(string: string | OnigString, callback?: (error: any, matches?: boolean) => void): void;
    private captureIndicesForMatch;
}
export default OnigRegExp;
