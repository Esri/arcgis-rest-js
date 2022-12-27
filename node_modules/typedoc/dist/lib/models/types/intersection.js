"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents an intersection type.
 *
 * ~~~
 * let value: A & B;
 * ~~~
 */
class IntersectionType extends abstract_1.Type {
    /**
     * Create a new TupleType instance.
     *
     * @param types  The types this union consists of.
     */
    constructor(types) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "intersection";
        this.types = types;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new IntersectionType(this.types);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof IntersectionType)) {
            return false;
        }
        return abstract_1.Type.isTypeListSimilar(type.types, this.types);
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        const names = [];
        this.types.forEach((element) => {
            names.push(element.toString());
        });
        return names.join(" & ");
    }
}
exports.IntersectionType = IntersectionType;
