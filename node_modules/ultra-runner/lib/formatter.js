"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFormatter = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = require("path");
// eslint-disable-next-line import/default
const string_width_1 = tslib_1.__importDefault(require("string-width"));
const wrap_ansi_1 = tslib_1.__importDefault(require("wrap-ansi"));
class CommandFormatter {
    constructor(cmd, level, spinner, options, packageName) {
        this.cmd = cmd;
        this.level = level;
        this.spinner = spinner;
        this.options = options;
        this.packageName = packageName;
        this.output = "";
    }
    format(prefix, text) {
        text = text.replace("\u001Bc", ""); // remove clear screen
        text = wrap_ansi_1.default(`${text}`, process.stdout.columns - string_width_1.default(prefix) - 1, {
            hard: true,
            trim: false,
            wordWrap: true,
        });
        return text.replace(/\n/gu, `\n${prefix}`);
    }
    write(data) {
        if (!this.options.pretty) {
            let cmdName = path_1.basename(this.cmd);
            if (this.packageName)
                cmdName = `${this.packageName}::${cmdName}`;
            const prefix = `${chalk_1.default.grey.dim(`[${cmdName}]`)} `;
            data = prefix + this.format(prefix, data);
            this.output += `${data}\n`;
            if (!this.options.silent)
                console.log(data);
        }
        else {
            const prefix = `${"".padEnd(this.level * 2)}${chalk_1.default.grey(`  │`)} `;
            let ret = this.format(prefix, data);
            if (!this.output.length)
                ret = prefix + ret;
            this.output += ret;
            if (!this.options.silent && this.spinner) {
                this.spinner.output += ret;
            }
        }
    }
}
exports.CommandFormatter = CommandFormatter;
//# sourceMappingURL=formatter.js.map