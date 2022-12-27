"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceType = void 0;
const abstract_1 = require("../reflections/abstract");
const abstract_2 = require("./abstract");
const BROKEN_REFERENCE_ID = -1;
/**
 * Represents a type that refers to another reflection like a class, interface or enum.
 *
 * ~~~
 * let value: MyClass;
 * ~~~
 */
class ReferenceType extends abstract_2.Type {
    /**
     * Create a new instance of ReferenceType.
     */
    constructor(name, target, project) {
        super();
        /**
         * The type name identifier.
         */
        this.type = "reference";
        /**
         * Horrible hacky solution to get around Handlebars messing with `this` in bad ways.
         * Don't use this if possible, it will go away once we use something besides handlebars for themes.
         */
        this.getReflection = () => this.reflection;
        this.name = name;
        this._target = target instanceof abstract_1.Reflection ? target.id : target;
        this._project = project;
    }
    /**
     * The resolved reflection.
     */
    get reflection() {
        if (typeof this._target === "number") {
            return this._project.getReflectionById(this._target);
        }
        const resolved = this._project.getReflectionFromSymbol(this._target);
        if (resolved)
            this._target = resolved.id;
        return resolved;
    }
    /** @internal this is used for type parameters, which don't actually point to something */
    static createBrokenReference(name, project) {
        return new ReferenceType(name, BROKEN_REFERENCE_ID, project);
    }
    /**
     * Clone this type.
     *
     * @return A clone of this type.
     */
    clone() {
        const clone = new ReferenceType(this.name, this._target, this._project);
        clone.typeArguments = this.typeArguments;
        return clone;
    }
    /**
     * Test whether this type equals the given type.
     *
     * @param other  The type that should be checked for equality.
     * @returns TRUE if the given type equals this type, FALSE otherwise.
     */
    equals(other) {
        var _a, _b;
        if (!(other instanceof ReferenceType)) {
            return false;
        }
        let matchesTarget;
        if (!this.reflection) {
            if (this._target === BROKEN_REFERENCE_ID &&
                other._target === BROKEN_REFERENCE_ID) {
                matchesTarget = this.name === other.name;
            }
            else {
                matchesTarget = this._target === other._target;
            }
        }
        else {
            matchesTarget = this.reflection === other.reflection;
        }
        if (!matchesTarget) {
            return false;
        }
        return abstract_2.Type.isTypeListEqual((_a = this.typeArguments) !== null && _a !== void 0 ? _a : [], (_b = other.typeArguments) !== null && _b !== void 0 ? _b : []);
    }
    /**
     * Return a string representation of this type.
     * @example EventEmitter<any>
     */
    toString() {
        const name = this.reflection ? this.reflection.name : this.name;
        let typeArgs = "";
        if (this.typeArguments && this.typeArguments.length > 0) {
            typeArgs += "<";
            typeArgs += this.typeArguments
                .map((arg) => arg.toString())
                .join(", ");
            typeArgs += ">";
        }
        return name + typeArgs;
    }
}
exports.ReferenceType = ReferenceType;
