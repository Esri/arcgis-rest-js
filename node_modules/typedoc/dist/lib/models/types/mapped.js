"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappedType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a mapped type.
 *
 * ```ts
 * { -readonly [K in keyof U & string as `a${K}`]?: Foo }
 * ```
 */
class MappedType extends abstract_1.Type {
    constructor(parameter, parameterType, templateType, readonlyModifier, optionalModifier, nameType) {
        super();
        this.parameter = parameter;
        this.parameterType = parameterType;
        this.templateType = templateType;
        this.readonlyModifier = readonlyModifier;
        this.optionalModifier = optionalModifier;
        this.nameType = nameType;
        this.type = "mapped";
    }
    clone() {
        var _a;
        return new MappedType(this.parameter, this.parameterType.clone(), this.templateType.clone(), this.readonlyModifier, this.optionalModifier, (_a = this.nameType) === null || _a === void 0 ? void 0 : _a.clone());
    }
    equals(other) {
        if (!(other instanceof MappedType)) {
            return false;
        }
        if (this.nameType && other.nameType) {
            if (!this.nameType.equals(other.nameType)) {
                return false;
            }
        }
        else if (this.nameType !== other.nameType) {
            return false;
        }
        return (other instanceof MappedType &&
            other.parameter == this.parameter &&
            other.parameterType.equals(this.parameterType) &&
            other.templateType.equals(this.templateType) &&
            other.readonlyModifier === this.readonlyModifier &&
            other.optionalModifier === this.optionalModifier);
    }
    toString() {
        var _a, _b;
        const read = {
            "+": "readonly",
            "-": "-readonly",
            "": "",
        }[(_a = this.readonlyModifier) !== null && _a !== void 0 ? _a : ""];
        const opt = {
            "+": "?",
            "-": "-?",
            "": "",
        }[(_b = this.optionalModifier) !== null && _b !== void 0 ? _b : ""];
        const name = this.nameType ? ` as ${this.nameType}` : "";
        return `{ ${read}[${this.parameter} in ${this.parameterType}${name}]${opt}: ${this.templateType}}`;
    }
}
exports.MappedType = MappedType;
