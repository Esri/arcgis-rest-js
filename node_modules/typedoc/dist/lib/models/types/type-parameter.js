"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeParameterType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a type parameter type.
 *
 * ~~~
 * let value: T;
 * ~~~
 */
class TypeParameterType extends abstract_1.Type {
    constructor(name) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "typeParameter";
        this.name = name;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        const clone = new TypeParameterType(this.name);
        clone.constraint = this.constraint;
        clone.default = this.default;
        return clone;
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof TypeParameterType)) {
            return false;
        }
        let constraintEquals = false;
        if (this.constraint && type.constraint) {
            constraintEquals = type.constraint.equals(this.constraint);
        }
        else if (!this.constraint && !type.constraint) {
            constraintEquals = true;
        }
        let defaultEquals = false;
        if (this.default && type.default) {
            defaultEquals = type.default.equals(this.default);
        }
        else if (!this.default && !type.default) {
            defaultEquals = true;
        }
        return constraintEquals && defaultEquals;
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return this.name;
    }
}
exports.TypeParameterType = TypeParameterType;
