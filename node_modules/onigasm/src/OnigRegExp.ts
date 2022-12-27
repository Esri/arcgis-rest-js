import OnigScanner, { IOnigCaptureIndex } from './OnigScanner'
import OnigString from './OnigString'

export interface IOnigSearchResult extends IOnigCaptureIndex {
    match: string
}

class OnigRegExp {
    private source: string
    private scanner: OnigScanner
    /**
     * Create a new regex with the given pattern
     * @param source A string pattern
     */
    constructor(source: string) {
        this.source = source

        try {
            this.scanner = new OnigScanner([this.source])
        } catch (error) {
            // doesn't make much sense, but this to pass atom/node-oniguruam tests
        }
    }

    /**
     * Synchronously search the string for a match starting at the given position
     * @param string The string to search
     * @param startPosition The optional position to start the search at, defaults to `0`
     */
    public searchSync(string: string | OnigString, startPosition?: number): IOnigSearchResult[] {
        let match
        if (startPosition == null) {
            startPosition = 0
        }
        match = this.scanner.findNextMatchSync(string, startPosition)
        return this.captureIndicesForMatch(string, match)
    }

    /**
     * Search the string for a match starting at the given position
     * @param string The string to search
     * @param startPosition The optional position to start the search at, defaults to `0`
     * @param callback The `(error, match)` function to call when done, match will be null if no matches were found. match will be an array of objects for each matched group on a successful search
     */
    public search(string: string | OnigString, startPosition?: number, callback?: (error: any, match?: IOnigSearchResult[]) => void) {
        if (startPosition == null) {
            startPosition = 0
        }
        if (typeof startPosition === 'function') {
            callback = startPosition
            startPosition = 0
        }
        try {
            const ret = this.searchSync(string, startPosition)
            callback(null, ret)
        } catch (error) {
            callback(error)
        }
    }

    /**
     * Synchronously test if this regular expression matches the given string
     * @param string The string to test against
     */
    public testSync(string: string | OnigString): boolean {
        if ((typeof this.source === 'boolean' || typeof string === 'boolean')) {
            return this.source === string
        }
        return this.searchSync(string) != null
    }

    /**
     * Test if this regular expression matches the given string
     * @param string The string to test against
     * @param callback The (error, matches) function to call when done, matches will be true if at least one match is found, false otherwise
     */
    public test(string: string | OnigString, callback?: (error: any, matches?: boolean) => void) {
        if (typeof callback !== 'function') {
            callback = () => { }
        }
        try {
            callback(null, this.testSync(string))
        } catch (error) {
            callback(error)
        }
    }

    private captureIndicesForMatch(string: string | OnigString, match) {
        if (match != null) {
            const { captureIndices } = match
            let capture
            string = this.scanner.convertToString(string)
            for (let i = 0; i < captureIndices.length; i++) {
                capture = captureIndices[i]
                capture.match = (string as string).slice(capture.start, capture.end)
            }
            return captureIndices
        } else {
            return null
        }
    }
}

export default OnigRegExp
