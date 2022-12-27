"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a type which has it's own reflection like literal types.
 *
 * ~~~
 * let value: {subValueA;subValueB;subValueC;};
 * ~~~
 */
class ReflectionType extends abstract_1.Type {
    /**
     * Create a new instance of ReflectionType.
     *
     * @param declaration  The reflection of the type.
     */
    constructor(declaration) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "reflection";
        this.declaration = declaration;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new ReflectionType(this.declaration);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        return type === this;
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        if (!this.declaration.children && this.declaration.signatures) {
            return "function";
        }
        else {
            return "object";
        }
    }
}
exports.ReflectionType = ReflectionType;
