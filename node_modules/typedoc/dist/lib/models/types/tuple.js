"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedTupleMember = exports.TupleType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a tuple type.
 *
 * ~~~
 * let value: [string,boolean];
 * ~~~
 */
class TupleType extends abstract_1.Type {
    /**
     * Create a new TupleType instance.
     *
     * @param elements  The ordered type elements of the tuple type.
     */
    constructor(elements) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "tuple";
        this.elements = elements;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new TupleType(this.elements);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof TupleType)) {
            return false;
        }
        return abstract_1.Type.isTypeListEqual(type.elements, this.elements);
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        const names = [];
        this.elements.forEach((element) => {
            names.push(element.toString());
        });
        return "[" + names.join(", ") + "]";
    }
}
exports.TupleType = TupleType;
class NamedTupleMember extends abstract_1.Type {
    constructor(name, isOptional, element) {
        super();
        this.name = name;
        this.isOptional = isOptional;
        this.element = element;
        this.type = "named-tuple-member";
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new NamedTupleMember(this.name, this.isOptional, this.element.clone());
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof NamedTupleMember)) {
            return false;
        }
        return (this.isOptional === type.isOptional &&
            this.element.equals(type.element));
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        return `${this.name}${this.isOptional ? "?" : ""}: ${this.element}`;
    }
}
exports.NamedTupleMember = NamedTupleMember;
