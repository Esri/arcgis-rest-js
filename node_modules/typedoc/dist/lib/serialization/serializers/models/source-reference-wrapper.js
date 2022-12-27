"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceReferenceWrapper = void 0;
/**
 * An internal concrete implementation for the [[ SourceReference ]] interface
 * so it can be identified
 */
class SourceReferenceWrapper {
    constructor(sourceReference) {
        this.sourceReference = sourceReference;
    }
}
exports.SourceReferenceWrapper = SourceReferenceWrapper;
