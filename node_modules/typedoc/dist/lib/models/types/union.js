"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionType = void 0;
const abstract_1 = require("./abstract");
const intrinsic_1 = require("./intrinsic");
const literal_1 = require("./literal");
/**
 * Represents an union type.
 *
 * ~~~
 * let value: string | string[];
 * ~~~
 */
class UnionType extends abstract_1.Type {
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
        this.type = "union";
        this.types = types;
        this.normalize();
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new UnionType(this.types);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        if (!(type instanceof UnionType)) {
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
        return names.join(" | ");
    }
    normalize() {
        const trueIndex = this.types.findIndex((t) => t.equals(new literal_1.LiteralType(true)));
        const falseIndex = this.types.findIndex((t) => t.equals(new literal_1.LiteralType(false)));
        if (trueIndex !== -1 && falseIndex !== -1) {
            this.types.splice(Math.max(trueIndex, falseIndex), 1);
            this.types.splice(Math.min(trueIndex, falseIndex), 1, new intrinsic_1.IntrinsicType("boolean"));
        }
    }
}
exports.UnionType = UnionType;
