"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterReflection = void 0;
const index_1 = require("../types/index");
const abstract_1 = require("./abstract");
class ParameterReflection extends abstract_1.Reflection {
    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    traverse(callback) {
        if (this.type instanceof index_1.ReflectionType) {
            if (callback(this.type.declaration, abstract_1.TraverseProperty.TypeLiteral) === false) {
                return;
            }
        }
        super.traverse(callback);
    }
    /**
     * Return a string representation of this reflection.
     */
    toString() {
        return super.toString() + (this.type ? ":" + this.type.toString() : "");
    }
}
exports.ParameterReflection = ParameterReflection;
