"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a rest type
 * ```ts
 * type Z = [1, ...2[]]
 * //           ^^^^^^
 * ```
 */
class RestType extends abstract_1.Type {
    /**
     * Create a new RestType instance.
     *
     * @param elementType The type of the array's elements.
     */
    constructor(elementType) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "rest";
        this.elementType = elementType;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new RestType(this.elementType.clone());
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof RestType)) {
            return false;
        }
        return type.elementType.equals(this.elementType);
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return `...${this.elementType.toString()}`;
    }
}
exports.RestType = RestType;
