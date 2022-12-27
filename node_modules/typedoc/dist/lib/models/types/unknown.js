"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents all unknown types.
 */
class UnknownType extends abstract_1.Type {
    /**
     * Create a new instance of UnknownType.
     *
     * @param name  A string representation of the type as returned from TypeScript compiler.
     */
    constructor(name) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "unknown";
        this.name = name;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new UnknownType(this.name);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        return type instanceof UnknownType && type.name === this.name;
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return this.name;
    }
}
exports.UnknownType = UnknownType;
