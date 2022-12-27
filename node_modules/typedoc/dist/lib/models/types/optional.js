"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalType = void 0;
const abstract_1 = require("./abstract");
const union_1 = require("./union");
const intersection_1 = require("./intersection");
/**
 * Represents an optional type
 * ```ts
 * type Z = [1, 2?]
 * //           ^^
 * ```
 */
class OptionalType extends abstract_1.Type {
    /**
     * Create a new OptionalType instance.
     *
     * @param elementType The type of the element
     */
    constructor(elementType) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "optional";
        this.elementType = elementType;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new OptionalType(this.elementType.clone());
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof OptionalType)) {
            return false;
        }
        return type.elementType.equals(this.elementType);
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        if (this.elementType instanceof union_1.UnionType ||
            this.elementType instanceof intersection_1.IntersectionType) {
            return `(${this.elementType.toString()})?`;
        }
        return `${this.elementType.toString()}?`;
    }
}
exports.OptionalType = OptionalType;
