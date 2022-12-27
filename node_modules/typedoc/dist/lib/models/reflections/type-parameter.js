"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeParameterReflection = void 0;
const abstract_1 = require("./abstract");
class TypeParameterReflection extends abstract_1.Reflection {
    /**
     * Create a new TypeParameterReflection instance.
     */
    constructor(name, constraint, defaultType, parent) {
        super(name, abstract_1.ReflectionKind.TypeParameter, parent);
        this.type = constraint;
        this.default = defaultType;
    }
}
exports.TypeParameterReflection = TypeParameterReflection;
