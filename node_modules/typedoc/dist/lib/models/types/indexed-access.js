"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedAccessType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents an indexed access type.
 */
class IndexedAccessType extends abstract_1.Type {
    /**
     * Create a new TupleType instance.
     *
     * @param elementType  The type of the array's elements.
     */
    constructor(objectType, indexType) {
        super();
        this.objectType = objectType;
        this.indexType = indexType;
        /**
         * The type name identifier.
         */
        this.type = "indexedAccess";
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new IndexedAccessType(this.objectType, this.indexType);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof IndexedAccessType)) {
            return false;
        }
        return (type.objectType.equals(this.objectType) &&
            type.indexType.equals(this.indexType));
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return `${this.objectType.toString()}[${this.indexType.toString()}]`;
    }
}
exports.IndexedAccessType = IndexedAccessType;
