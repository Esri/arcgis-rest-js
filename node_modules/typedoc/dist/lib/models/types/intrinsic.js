"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrinsicType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents an intrinsic type like `string` or `boolean`.
 *
 * ~~~
 * let value: number;
 * ~~~
 */
class IntrinsicType extends abstract_1.Type {
    /**
     * Create a new instance of IntrinsicType.
     *
     * @param name  The name of the intrinsic type like `string` or `boolean`.
     */
    constructor(name) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "intrinsic";
        this.name = name;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new IntrinsicType(this.name);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        return type instanceof IntrinsicType && type.name === this.name;
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return this.name;
    }
}
exports.IntrinsicType = IntrinsicType;
