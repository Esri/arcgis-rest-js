"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
/* c8 ignore next 4 */
const isSupported = process.platform !== "win32" ||
    process.env.CI ||
    process.env.TERM === "xterm-256color";
const main = {
    info: chalk_1.default.blue("ℹ"),
    success: chalk_1.default.green("✔"),
    warning: chalk_1.default.yellow("⚠"),
    error: chalk_1.default.red("✖"),
    bullet: "●",
};
const fallbacks = {
    info: chalk_1.default.blue("i"),
    success: chalk_1.default.green("√"),
    warning: chalk_1.default.yellow("‼"),
    error: chalk_1.default.red("×"),
    bullet: "*",
};
function get(name) {
    /* c8 ignore next */
    const symbols = isSupported ? main : fallbacks;
    return symbols[name];
}
exports.default = Object.assign(Object.assign({}, (isSupported ? main : /* c8 ignore next */ fallbacks)), { get });
//# sourceMappingURL=symbols.js.map