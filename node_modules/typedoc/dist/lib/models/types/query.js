"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryType = void 0;
const abstract_1 = require("./abstract");
/**
 * Represents a type that is constructed by querying the type of a reflection.
 * ```ts
 * const x = 1
 * type Z = typeof x // query on reflection for x
 * ```
 */
class QueryType extends abstract_1.Type {
    constructor(reference) {
        super();
        this.type = "query";
        this.queryType = reference;
    }
    clone() {
        return new QueryType(this.queryType);
    }
    equals(other) {
        return (other instanceof QueryType && this.queryType.equals(other.queryType));
    }
    toString() {
        return `typeof ${this.queryType.toString()}`;
    }
}
exports.QueryType = QueryType;
