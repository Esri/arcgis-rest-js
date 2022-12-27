"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifCond = void 0;
/**
 * Handlebars if helper with condition.
 *
 * @param v1        The first value to be compared.
 * @param operator  The operand to perform on the two given values.
 * @param v2        The second value to be compared
 * @param options   The current handlebars object.
 * @param this   The current handlebars this.
 * @returns {*}
 */
function ifCond(v1, operator, v2, options) {
    switch (operator) {
        case "==":
            return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
            return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
            return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
            return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
            return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
            return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
            return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
            return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
            return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
            return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
}
exports.ifCond = ifCond;
