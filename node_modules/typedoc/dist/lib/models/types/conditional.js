"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a conditional type.
 *
 * ~~~
 * let value: C extends E ? T : F;
 * let value2: Check extends Extends ? True : False;
 * ~~~
 */
class ConditionalType extends abstract_1.Type {
    constructor(checkType, extendsType, trueType, falseType) {
        super();
        this.checkType = checkType;
        this.extendsType = extendsType;
        this.trueType = trueType;
        this.falseType = falseType;
        /**
         * The type name identifier.
         */
        this.type = "conditional";
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new ConditionalType(this.checkType, this.extendsType, this.trueType, this.falseType);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof ConditionalType)) {
            return false;
        }
        return (this.checkType.equals(type.checkType) &&
            this.extendsType.equals(type.extendsType) &&
            this.trueType.equals(type.trueType) &&
            this.falseType.equals(type.falseType));
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return (this.checkType +
            " extends " +
            this.extendsType +
            " ? " +
            this.trueType +
            " : " +
            this.falseType);
    }
}
exports.ConditionalType = ConditionalType;
