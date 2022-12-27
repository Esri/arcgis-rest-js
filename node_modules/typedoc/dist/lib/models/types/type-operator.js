"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOperatorType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a type operator type.
 *
 * ~~~
 * class A {}
 * class B<T extends keyof A> {}
 * ~~~
 */
class TypeOperatorType extends abstract_1.Type {
    constructor(target, operator) {
        super();
        this.target = target;
        this.operator = operator;
        /**
         * The type name identifier.
         */
        this.type = "typeOperator";
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new TypeOperatorType(this.target.clone(), this.operator);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof TypeOperatorType)) {
            return false;
        }
        return (type instanceof TypeOperatorType &&
            type.operator === this.operator &&
            type.target.equals(this.target));
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return `${this.operator} ${this.target.toString()}`;
    }
}
exports.TypeOperatorType = TypeOperatorType;
