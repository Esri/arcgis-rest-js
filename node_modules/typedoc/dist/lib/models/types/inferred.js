"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferredType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents an inferred type, U in the example below.
 *
 * ```ts
 * type Z = Promise<string> extends Promise<infer U> : never
 * ```
 */
class InferredType extends abstract_1.Type {
    constructor(name) {
        super();
        this.name = name;
        /**
         * The type name identifier.
         */
        this.type = "inferred";
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new InferredType(this.name);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof InferredType)) {
            return false;
        }
        return this.name === type.name;
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return `infer ${this.name}`;
    }
}
exports.InferredType = InferredType;
