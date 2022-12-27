"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const abstract_1 = require("./abstract");
const intersection_1 = require("./intersection");
const union_1 = require("./union");
/**
 * Represents an array type.
 *
 * ~~~
 * let value: string[];
 * ~~~
 */
class ArrayType extends abstract_1.Type {
    /**
     * Create a new TupleType instance.
     *
     * @param elementType  The type of the array's elements.
     */
    constructor(elementType) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "array";
        this.elementType = elementType;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new ArrayType(this.elementType);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof ArrayType)) {
            return false;
        }
        return type.elementType.equals(this.elementType);
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        const elementTypeStr = this.elementType.toString();
        if (this.elementType instanceof union_1.UnionType ||
            this.elementType instanceof intersection_1.IntersectionType) {
            return "(" + elementTypeStr + ")[]";
        }
        else {
            return elementTypeStr + "[]";
        }
    }
}
exports.ArrayType = ArrayType;
