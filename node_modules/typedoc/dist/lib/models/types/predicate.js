"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredicateType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a type predicate.
 *
 * ```ts
 * function isString(anything: any): anything is string {}
 * function assert(condition: boolean): asserts condition {}
 * ```
 */
class PredicateType extends abstract_1.Type {
    /**
     * Create a new PredicateType instance.
     */
    constructor(name, asserts, targetType) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "predicate";
        this.name = name;
        this.asserts = asserts;
        this.targetType = targetType;
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        return new PredicateType(this.name, this.asserts, this.targetType);
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param type  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(type) {
        var _a, _b;
        if (!(type instanceof PredicateType)) {
            return false;
        }
        if (!this.targetType && type.targetType) {
            return false;
        }
        if (this.targetType && !type.targetType) {
            return false;
        }
        return (this.name === type.name &&
            this.asserts === type.asserts &&
            ((_b = (_a = this.targetType) === null || _a === void 0 ? void 0 : _a.equals(type.targetType)) !== null && _b !== void 0 ? _b : true));
    }
    /**
     * Return a string representation of this type.
     */
    toString() {
        const out = this.asserts ? ["asserts", this.name] : [this.name];
        if (this.targetType) {
            out.push("is", this.targetType.toString());
        }
        return out.join(" ");
    }
}
exports.PredicateType = PredicateType;
