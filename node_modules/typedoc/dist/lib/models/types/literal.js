"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a string literal type.
 *
 * ```ts
 * type A = "A"
 * type B = 1
 * ```
 */
class LiteralType extends abstract_1.Type {
    constructor(value) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "literal";
        this.value = value;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new LiteralType(this.value);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param other  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(other) {
        return other instanceof LiteralType && other.value === this.value;
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        if (typeof this.value === "bigint") {
            return this.value.toString();
        }
        return JSON.stringify(this.value);
    }
}
exports.LiteralType = LiteralType;
