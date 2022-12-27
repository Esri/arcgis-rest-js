
type UintArray = Uint8Array | Uint16Array | Uint32Array

class OnigString {
    private source: string
    private _utf8Bytes: Uint8Array | null

    /**
     * utf16-offset where the mapping table starts. Before that index: utf16-index === utf8-index
     */
    private _mappingTableStartOffset: number
    /**
     * utf-16 to utf-8 mapping table for all uft-8 indexes starting at `_mappingTableStartOffset`. utf8-index are always starting at 0.
     * `null` if there are no multibyte characters in the utf8 string and all utf-8 indexes are matching the utf-16 indexes.
     * Example: _mappingTableStartOffset === 10, _utf16OffsetToUtf8 = [0, 3, 6] -> _utf8Indexes[10] = 10, _utf8Indexes[11] = 13
     */
    private _utf8Indexes: UintArray | null

    constructor(content: string) {
        if (typeof content !== 'string') {
            throw new TypeError('Argument must be a string')
        }
        this.source = content
        this._utf8Bytes = null
        this._utf8Indexes = null

    }

    public get utf8Bytes(): Uint8Array {
        if (!this._utf8Bytes) {
            this.encode()
        }
        return this._utf8Bytes
    }

    /**
     * Returns `null` if all utf8 offsets match utf-16 offset (content has no multi byte characters)
     */
    private get utf8Indexes(): UintArray {
        if (!this._utf8Bytes) {
            this.encode()
        }
        return this._utf8Indexes
    }

    public get content(): string {
        return this.source
    }

    public get length(): number {
        return this.source.length
    }

    public substring = (start, end) => {
        return this.source.substring(start, end)
    }

    public toString = (start, end) => {
        return this.source
    }

    public get hasMultiByteCharacters() {
        return this.utf8Indexes !== null
    }

    public convertUtf8OffsetToUtf16(utf8Offset: number): number {
        if (utf8Offset < 0) {
            return 0
        }
        const utf8Array = this._utf8Bytes
        if (utf8Offset >= utf8Array.length - 1) {
            return this.source.length
        }

        const utf8OffsetMap = this.utf8Indexes
        if (utf8OffsetMap && utf8Offset >= this._mappingTableStartOffset) {
            return findFirstInSorted(utf8OffsetMap, utf8Offset - this._mappingTableStartOffset) + this._mappingTableStartOffset
        }
        return utf8Offset
    }

    public convertUtf16OffsetToUtf8(utf16Offset: number): number {
        if (utf16Offset < 0) {
            return 0
        }
        const utf8Array = this._utf8Bytes
        if (utf16Offset >= this.source.length) {
            return utf8Array.length - 1
        }

        const utf8OffsetMap = this.utf8Indexes
        if (utf8OffsetMap && utf16Offset >= this._mappingTableStartOffset) {
            return utf8OffsetMap[utf16Offset - this._mappingTableStartOffset] + this._mappingTableStartOffset
        }
        return utf16Offset
    }

    private encode(): void {
        const str = this.source
        const n = str.length
        let utf16OffsetToUtf8: UintArray
        let utf8Offset = 0
        let mappingTableStartOffset = 0
        function createOffsetTable(startOffset: number) {
            const maxUtf8Len = (n - startOffset) * 3
            if (maxUtf8Len <= 0xff) {
                utf16OffsetToUtf8 = new Uint8Array(n - startOffset)
            } else if (maxUtf8Len <= 0xffff) {
                utf16OffsetToUtf8 = new Uint16Array(n - startOffset)
            } else {
                utf16OffsetToUtf8 = new Uint32Array(n - startOffset)
            }
            mappingTableStartOffset = startOffset
            utf16OffsetToUtf8[utf8Offset++] = 0
        }

        const u8view = new Uint8Array((n * 3) /* alloc max now, trim later*/ + 1 /** null termination character */)

        let ptrHead = 0
        let i = 0
        // for some reason, v8 is faster with str.length than using a variable (might be illusion)
        while (i < str.length) {
            let codepoint
            const c = str.charCodeAt(i)

            if (utf16OffsetToUtf8) {
                utf16OffsetToUtf8[utf8Offset++] = ptrHead - mappingTableStartOffset
            }

            if (c < 0xD800 || c > 0xDFFF) {
                codepoint = c
            }

            else if (c >= 0xDC00) {
                codepoint = 0xFFFD
            }

            else {
                if (i === n - 1) {
                    codepoint = 0xFFFD
                }
                else {
                    const d = str.charCodeAt(i + 1)

                    if (0xDC00 <= d && d <= 0xDFFF) {
                        if (!utf16OffsetToUtf8) {
                            createOffsetTable(i)
                        }

                        const a = c & 0x3FF

                        const b = d & 0x3FF

                        codepoint = 0x10000 + (a << 10) + b
                        i += 1

                        utf16OffsetToUtf8[utf8Offset++] = ptrHead - mappingTableStartOffset
                    }

                    else {
                        codepoint = 0xFFFD
                    }
                }
            }

            let bytesRequiredToEncode: number
            let offset: number

            if (codepoint <= 0x7F) {
                bytesRequiredToEncode = 1
                offset = 0
            } else if (codepoint <= 0x07FF) {
                bytesRequiredToEncode = 2
                offset = 0xC0
            } else if (codepoint <= 0xFFFF) {
                bytesRequiredToEncode = 3
                offset = 0xE0
            } else {
                bytesRequiredToEncode = 4
                offset = 0xF0
            }

            if (bytesRequiredToEncode === 1) {
                u8view[ptrHead++] = codepoint
            }
            else {
                if (!utf16OffsetToUtf8) {
                    createOffsetTable(ptrHead)
                }
                u8view[ptrHead++] = (codepoint >> (6 * (--bytesRequiredToEncode))) + offset

                while (bytesRequiredToEncode > 0) {

                    const temp = codepoint >> (6 * (bytesRequiredToEncode - 1))

                    u8view[ptrHead++] = (0x80 | (temp & 0x3F))

                    bytesRequiredToEncode -= 1
                }
            }

            i += 1
        }

        const utf8 = u8view.slice(0, ptrHead + 1)
        utf8[ptrHead] = 0x00

        this._utf8Bytes = utf8
        if (utf16OffsetToUtf8) { // set if UTF-16 surrogate chars or multi-byte characters found
            this._utf8Indexes = utf16OffsetToUtf8
            this._mappingTableStartOffset = mappingTableStartOffset
        }
    }
}

function findFirstInSorted<T>(array: UintArray, i: number): number {
    let low = 0
    let high = array.length

    if (high === 0) {
        return 0 // no children
    }
    while (low < high) {
        const mid = Math.floor((low + high) / 2)
        if (array[mid] >= i) {
            high = mid
        } else {
            low = mid + 1
        }
    }

    // low is on the index of the first value >= i or array.length. Decrement low until we find array[low] <= i
    while (low > 0 && (low >= array.length || array[low] > i)) {
        low--
    }
    // check whether we are on the second index of a utf-16 surrogate char. If so, go to the first index.
    if (low > 0 && array[low] === array[low - 1]) {
        low--
    }

    return low

}

export default OnigString
