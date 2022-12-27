"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputSpinner = exports.Spinner = exports.SpinnerResult = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
// eslint-disable-next-line import/default
const perf_hooks_1 = require("perf_hooks");
const symbols_1 = tslib_1.__importDefault(require("./symbols"));
const terminal_1 = require("./terminal");
var SpinnerResult;
(function (SpinnerResult) {
    SpinnerResult[SpinnerResult["success"] = 1] = "success";
    SpinnerResult[SpinnerResult["error"] = 2] = "error";
    SpinnerResult[SpinnerResult["warning"] = 3] = "warning";
})(SpinnerResult = exports.SpinnerResult || (exports.SpinnerResult = {}));
class Spinner {
    constructor(text, level = 0) {
        this.text = text;
        this.level = level;
        this.output = "";
        this.start = perf_hooks_1.performance.now();
    }
    format(symbol) {
        const padding = "".padEnd(this.level * 2);
        const output = this.output.length ? `\n${this.output}` : "";
        if (this.result) {
            symbol = symbols_1.default.get(SpinnerResult[this.result]);
            if (this.stop) {
                const duration = (this.stop - this.start) / 1000;
                let du = `${duration.toFixed(3)}s`;
                if (duration < 1)
                    du = `${(duration * 1000).toFixed(0)}ms`;
                return `${padding}${symbol} ${this.text} ${chalk_1.default.grey.dim(du)}${output}`;
            }
        }
        return `${padding}${symbol} ${this.text}${output}`;
    }
}
exports.Spinner = Spinner;
class OutputSpinner {
    constructor(stream = process.stdout) {
        this.stream = stream;
        /* c8 ignore next */
        this.spinner = process.platform === "win32"
            ? {
                interval: 130,
                frames: ["-", "\\", "|", "/"],
            }
            : {
                interval: 120,
                frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
            };
        this.frame = 0;
        this.running = false;
        this.spinnerMap = new Map();
        this.terminal = new terminal_1.Terminal(stream);
    }
    render(full = false) {
        const symbol = chalk_1.default.yellow(this.spinner.frames[this.frame]);
        let lineCount = 0;
        const spinnerLines = this.spinners.map((spinner) => {
            const text = `${spinner.format(symbol)}`;
            const lines = text.split("\n");
            lineCount += Math.min(lines.length, 3);
            return { count: Math.min(lines.length, 3), lines };
        });
        while (lineCount < process.stdout.rows) {
            const loopLineCount = +lineCount;
            spinnerLines.every((s) => {
                if (s.lines.length > s.count) {
                    s.count++;
                    lineCount++;
                }
                return lineCount < process.stdout.rows;
            });
            if (lineCount == loopLineCount)
                break;
        }
        const limitLines = (lines, count) => {
            const ret = [lines[0]];
            if (count > 1)
                ret.push(...lines.slice(1 - count));
            return ret;
        };
        let text = `${spinnerLines
            .map((s) => (full ? s.lines : limitLines(s.lines, s.count)).join("\n"))
            .join("\n")}\n`;
        if (!full)
            text = text.trim();
        let lines = text.split("\n");
        if (!full)
            lines = lines.slice(-process.stdout.rows);
        this.terminal.update(lines);
    }
    get spinners() {
        var _a, _b;
        const ret = new Array();
        // eslint-disable-next-line unicorn/no-useless-undefined
        const queue = (_b = (_a = this.spinnerMap.get(undefined)) === null || _a === void 0 ? void 0 : _a.slice()) !== null && _b !== void 0 ? _b : [];
        while (queue.length) {
            const spinner = queue.shift();
            ret.push(spinner);
            queue.unshift(...(this.spinnerMap.get(spinner) || []));
        }
        return ret;
    }
    start(text, level = 0, parentSpinner) {
        var _a;
        const s = new Spinner(text, level);
        if (!this.spinnerMap.has(parentSpinner))
            this.spinnerMap.set(parentSpinner, []);
        (_a = this.spinnerMap.get(parentSpinner)) === null || _a === void 0 ? void 0 : _a.push(s);
        // this.spinners.push(s)
        if (!this.running)
            this._start();
        this.render();
        return s;
    }
    stop(spinner) {
        spinner.stop = perf_hooks_1.performance.now();
        this.render();
    }
    error(spinner) {
        spinner.result = SpinnerResult.error;
        this.stop(spinner);
    }
    warning(spinner) {
        spinner.result = SpinnerResult.warning;
        this.stop(spinner);
    }
    success(spinner) {
        spinner.result = SpinnerResult.success;
        this.stop(spinner);
    }
    _start() {
        /* c8 ignore next */
        if (this.running)
            return;
        this.running = true;
        this.interval = setInterval(() => {
            /* c8 ignore next 2 */
            this.frame = ++this.frame % this.spinner.frames.length;
            this.render();
        }, this.spinner.interval);
    }
    _stop() {
        if (this.running) {
            if (this.interval)
                clearInterval(this.interval);
            this.render(true);
            this.interval = undefined;
            this.running = false;
            this.spinnerMap.clear();
        }
    }
}
exports.OutputSpinner = OutputSpinner;
//# sourceMappingURL=spinner.js.map