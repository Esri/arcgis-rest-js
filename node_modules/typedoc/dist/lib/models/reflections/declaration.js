"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclarationReflection = void 0;
const index_1 = require("../types/index");
const abstract_1 = require("./abstract");
const container_1 = require("./container");
/**
 * A reflection that represents a single declaration emitted by the TypeScript compiler.
 *
 * All parts of a project are represented by DeclarationReflection instances. The actual
 * kind of a reflection is stored in its ´kind´ member.
 */
class DeclarationReflection extends container_1.ContainerReflection {
    hasGetterOrSetter() {
        return !!this.getSignature || !!this.setSignature;
    }
    getAllSignatures() {
        let result = [];
        if (this.signatures) {
            result = result.concat(this.signatures);
        }
        if (this.indexSignature) {
            result.push(this.indexSignature);
        }
        if (this.getSignature) {
            result.push(this.getSignature);
        }
        if (this.setSignature) {
            result.push(this.setSignature);
        }
        return result;
    }
    /** @internal */
    getNonIndexSignatures() {
        var _a, _b, _c;
        return [].concat((_a = this.signatures) !== null && _a !== void 0 ? _a : [], (_b = this.setSignature) !== null && _b !== void 0 ? _b : [], (_c = this.getSignature) !== null && _c !== void 0 ? _c : []);
    }
    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    traverse(callback) {
        var _a, _b;
        for (const parameter of (_a = this.typeParameters) !== null && _a !== void 0 ? _a : []) {
            if (callback(parameter, abstract_1.TraverseProperty.TypeParameter) === false) {
                return;
            }
        }
        if (this.type instanceof index_1.ReflectionType) {
            if (callback(this.type.declaration, abstract_1.TraverseProperty.TypeLiteral) === false) {
                return;
            }
        }
        for (const signature of (_b = this.signatures) !== null && _b !== void 0 ? _b : []) {
            if (callback(signature, abstract_1.TraverseProperty.Signatures) === false) {
                return;
            }
        }
        if (this.indexSignature) {
            if (callback(this.indexSignature, abstract_1.TraverseProperty.IndexSignature) === false) {
                return;
            }
        }
        if (this.getSignature) {
            if (callback(this.getSignature, abstract_1.TraverseProperty.GetSignature) ===
                false) {
                return;
            }
        }
        if (this.setSignature) {
            if (callback(this.setSignature, abstract_1.TraverseProperty.SetSignature) ===
                false) {
                return;
            }
        }
        super.traverse(callback);
    }
    /**
     * Return a string representation of this reflection.
     */
    toString() {
        let result = super.toString();
        if (this.typeParameters) {
            const parameters = [];
            this.typeParameters.forEach((parameter) => {
                parameters.push(parameter.name);
            });
            result += "<" + parameters.join(", ") + ">";
        }
        if (this.type) {
            result += ":" + this.type.toString();
        }
        return result;
    }
}
exports.DeclarationReflection = DeclarationReflection;
