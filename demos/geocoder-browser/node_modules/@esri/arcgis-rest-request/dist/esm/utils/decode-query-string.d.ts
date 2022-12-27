export declare function decodeParam(param: string): {
    key: string;
    value: string;
};
/**
 * Decodes the passed query string as an object.
 *
 * @param query A string to be decoded.
 * @returns A decoded query param object.
 */
export declare function decodeQueryString(query?: string): {
    [key: string]: string;
};
