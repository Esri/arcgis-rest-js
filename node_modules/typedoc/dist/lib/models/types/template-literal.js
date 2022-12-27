"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLiteralType = void 0;
const abstract_1 = require("./abstract");
/**
 * TS 4.1 template literal types
 * ```ts
 * type Z = `${'a' | 'b'}${'a' | 'b'}`
 * ```
 */
class TemplateLiteralType extends abstract_1.Type {
    constructor(head, tail) {
        super();
        this.type = "template-literal";
        this.head = head;
        this.tail = tail;
    }
    clone() {
        return new TemplateLiteralType(this.head, this.tail.map(([type, text]) => [type.clone(), text]));
    }
    equals(other) {
        return (other instanceof TemplateLiteralType &&
            this.head === other.head &&
            this.tail.length === other.tail.length &&
            this.tail.every(([type, text], i) => {
                return (type.equals(other.tail[i][0]) && text === other.tail[i][1]);
            }));
    }
    toString() {
        return [
            "`",
            this.head,
            ...this.tail.map(([type, text]) => {
                return "${" + type + "}" + text;
            }),
            "`",
        ].join("");
    }
}
exports.TemplateLiteralType = TemplateLiteralType;
