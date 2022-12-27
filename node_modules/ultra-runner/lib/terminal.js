"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terminal = exports.hideCursor = exports.showCursor = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ansi_split_1 = tslib_1.__importDefault(require("ansi-split"));
const readline_1 = tslib_1.__importDefault(require("readline"));
// eslint-disable-next-line import/default
const string_width_1 = tslib_1.__importDefault(require("string-width"));
function showCursor(stream = process.stderr) {
    stream.isTTY && stream.write("\u001B[?25h");
}
exports.showCursor = showCursor;
function hideCursor(stream = process.stderr) {
    if (!stream.isTTY)
        return;
    ["SIGTERM", "SIGINT"].forEach((event) => process.once(event, () => showCursor(stream)));
    process.once("exit", () => showCursor(stream));
    stream.write("\u001B[?25l");
}
exports.hideCursor = hideCursor;
class Terminal {
    constructor(stream = process.stdout, options = { clearScreen: false }) {
        this.stream = stream;
        this.options = options;
        this.lines = [];
        this.output = "";
        this.resized = false;
        stream.setMaxListeners(50);
        stream.on("resize", () => (this.resized = true));
        hideCursor(stream);
        if (options.clearScreen)
            this.clearScreen();
    }
    clearScreen() {
        readline_1.default.cursorTo(this.stream, 0, 0);
        readline_1.default.clearScreenDown(this.stream);
        this.lines = [];
    }
    diff(from, to) {
        if (!from || !to || from.length !== to.length)
            return;
        const fromParts = ansi_split_1.default(from);
        const toParts = ansi_split_1.default(to);
        let left = 0;
        let leftP = 0;
        let leftWidth = 0;
        let right = 0;
        if (fromParts.length == toParts.length) {
            // eslint-disable-next-line unicorn/no-for-loop
            for (let i = 0; i < toParts.length; i++) {
                if (fromParts[i] == toParts[i]) {
                    leftP = i + 1;
                    left += toParts[i].length;
                    leftWidth += string_width_1.default(toParts[i]);
                }
                else
                    break;
            }
            // eslint-disable-next-line unicorn/no-for-loop
            for (let i = toParts.length - 1; i >= 0; i--) {
                if (fromParts[i] == toParts[i]) {
                    right += toParts[i].length;
                }
                else
                    break;
            }
        }
        else
            return;
        // Even idx is a non-ansi string, so add previous ansi string to result
        if (leftP > 0 && leftP % 2 == 0) {
            left -= toParts[leftP - 1].length;
        }
        return left > 0 || right > 0
            ? {
                left: leftWidth,
                str: to.slice(left),
                // FIX: str: to.slice(left, -right + 1),
            }
            : undefined;
    }
    update(text) {
        this.output = "";
        if (this.resized) {
            this.lines = [];
            this.resized = false;
            if (this.options.clearScreen) {
                this.clearScreen();
            }
            else {
                readline_1.default.moveCursor(this.stream, 0, -this.lines.length + 1);
                readline_1.default.cursorTo(this.stream, 0);
                readline_1.default.clearScreenDown(this.stream);
            }
        }
        const lines = Array.isArray(text) ? text : text.split("\n");
        // Check if we will write the same lines
        if (lines.length == this.lines.length &&
            lines.every((line, idx) => this.lines[idx] == line))
            return this.output;
        // Move cursor to first line
        if (this.lines.length)
            readline_1.default.moveCursor(this.stream, 0, -this.lines.length + 1);
        // Update existing lines
        for (let l = 0; l < this.lines.length; l++) {
            const line = lines[l];
            if (line != this.lines[l]) {
                const diff = this.diff(line, this.lines[l]);
                if (diff) {
                    readline_1.default.cursorTo(this.stream, diff.left);
                    this.stream.write(diff.str);
                }
                else {
                    readline_1.default.cursorTo(this.stream, 0);
                    if (!line || string_width_1.default(line) < string_width_1.default(this.lines[l]))
                        readline_1.default.clearLine(this.stream, 0);
                    if (line)
                        this.stream.write(line);
                }
            }
            if (l < this.lines.length - 1)
                readline_1.default.moveCursor(this.stream, 0, 1);
        }
        // Render remaining lines
        if (lines.length > this.lines.length) {
            if (this.lines.length > 0)
                this.stream.write("\n");
            this.stream.write(lines.slice(this.lines.length).join("\n"));
        }
        this.lines = lines;
    }
}
exports.Terminal = Terminal;
//# sourceMappingURL=terminal.js.map