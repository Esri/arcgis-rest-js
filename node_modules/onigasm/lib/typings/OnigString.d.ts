declare class OnigString {
    private source;
    private _utf8Bytes;
    /**
     * utf16-offset where the mapping table starts. Before that index: utf16-index === utf8-index
     */
    private _mappingTableStartOffset;
    /**
     * utf-16 to utf-8 mapping table for all uft-8 indexes starting at `_mappingTableStartOffset`. utf8-index are always starting at 0.
     * `null` if there are no multibyte characters in the utf8 string and all utf-8 indexes are matching the utf-16 indexes.
     * Example: _mappingTableStartOffset === 10, _utf16OffsetToUtf8 = [0, 3, 6] -> _utf8Indexes[10] = 10, _utf8Indexes[11] = 13
     */
    private _utf8Indexes;
    constructor(content: string);
    get utf8Bytes(): Uint8Array;
    /**
     * Returns `null` if all utf8 offsets match utf-16 offset (content has no multi byte characters)
     */
    private get utf8Indexes();
    get content(): string;
    get length(): number;
    substring: (start: any, end: any) => string;
    toString: (start: any, end: any) => string;
    get hasMultiByteCharacters(): boolean;
    convertUtf8OffsetToUtf16(utf8Offset: number): number;
    convertUtf16OffsetToUtf8(utf16Offset: number): number;
    private encode;
}
export default OnigString;
