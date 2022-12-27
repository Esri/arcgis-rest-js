"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeTop = void 0;
const tslib_1 = require("tslib");
const pslist = require("ps-list");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = require("path");
const readline_1 = tslib_1.__importDefault(require("readline"));
const shellwords_ts_1 = require("shellwords-ts");
const package_1 = require("./package");
const process_1 = require("./process");
const terminal_1 = require("./terminal");
const pidCwd = require("pid-cwd");
const stringWidth = require("string-width");
function parseCommand(proc) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!proc.cmd)
            proc.cmd = "node";
        const ret = Object.assign(Object.assign({}, proc), { argv: shellwords_ts_1.split(proc.cmd).map((ss) => path_1.normalize(ss)), children: [] });
        if ((_a = proc.cmd) === null || _a === void 0 ? void 0 : _a.includes("Visual Studio Code")) {
            ret.argv = ["vscode"];
        }
        else {
            // shift node binary
            ret.argv.shift();
            if (!ret.argv.length)
                ret.argv[0] = proc.cmd || proc.name;
            // shift all node options
            while (ret.argv.length && ret.argv[0].startsWith("-"))
                ret.argv.shift();
            if (!ret.argv.length)
                ret.argv[0] = proc.cmd || proc.name;
            // Compact node_modules scripts
            ret.argv[0] = ret.argv[0].replace(/^.*node_modules\/.*\/([^/]+?)(\.[tj]s)?$/u, (_str, bin) => bin);
            // Compact all node_modules stuff
            ret.argv = ret.argv.map((arg) => arg.replace(/.*node_modules\//u, ""));
            // Replace common binaries
            const knownBins = ["npx", "npm"];
            knownBins.forEach((r) => {
                if (new RegExp(`/${r}(.[tj]s)?$`, "u").test(ret.argv[0]))
                    ret.argv[0] = r;
            });
            ret.argv[0] = ret.argv[0].replace(/^\.bin\//u, "");
        }
        ret.cwd = yield pidCwd(proc.pid);
        if (ret.cwd) {
            const root = package_1.findUp("package.json", ret.cwd);
            if (root) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ret.project = (_b = (yield Promise.resolve().then(() => tslib_1.__importStar(require(path_1.resolve(ret.cwd, "package.json")))))) === null || _b === void 0 ? void 0 : _b.name;
                if (ret.argv[0].startsWith(root))
                    ret.argv[0] = path_1.relative(root, ret.argv[0]);
            }
            if (!ret.project)
                ret.project = path_1.basename(ret.cwd);
        }
        return ret;
    });
}
function getProcessList() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const procs = (yield pslist())
            .map((proc) => {
            var _a, _b, _c;
            const name = ((_a = proc.cmd) === null || _a === void 0 ? void 0 : _a.length) ? (_c = (_b = proc.cmd) === null || _b === void 0 ? void 0 : _b.split(" ")) === null || _c === void 0 ? void 0 : _c[0] : proc.name;
            return Object.assign(Object.assign({}, proc), { name });
        })
            .filter((proc) => {
            var _a;
            return ((_a = proc.cmd) === null || _a === void 0 ? void 0 : _a.includes("Visual Studio Code")) ||
                /node(\.exe)?/iu.test(path_1.basename(proc.name));
        });
        return yield Promise.all(procs.map((proc) => parseCommand(proc)));
    });
}
function getTotalCpu(proc) {
    return ((proc.cpu || 0) +
        proc.children.reduce((p, c) => (getTotalCpu(c) || 0) + p, 0));
}
function getProcessTree() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let procs = yield getProcessList();
        const vscode = {
            pid: -1,
            name: "vscode",
            ppid: 0,
            argv: ["vscode"],
            children: [],
            cpu: 0,
            memory: 0,
        };
        procs
            .filter((proc) => proc.argv[0] == "vscode")
            .forEach((proc) => {
            vscode.pid = proc.pid;
            vscode.cpu = (vscode.cpu || 0) + (proc.cpu || 0);
            vscode.memory = (vscode.memory || 0) + (proc.memory || 0);
        });
        vscode.cpu = Math.round((vscode.cpu || 0) * 10) / 10;
        vscode.memory = Math.round((vscode.memory || 0) * 10) / 10;
        const vscodePids = new Set(procs.filter((proc) => proc.argv[0] == "vscode").map((proc) => proc.pid));
        procs.forEach((proc) => {
            if (vscodePids.has(proc.ppid))
                proc.ppid = vscode.pid;
        });
        procs = procs.filter((proc) => proc.argv[0] != "vscode");
        procs.push(vscode);
        const pids = new Map(procs.map((proc) => [proc.pid, proc]));
        const children = new Set();
        procs.forEach((proc) => {
            var _a;
            if (pids.has(proc.ppid)) {
                (_a = pids.get(proc.ppid)) === null || _a === void 0 ? void 0 : _a.children.push(proc);
                children.add(proc.pid);
            }
        });
        return procs
            .filter((proc) => !children.has(proc.pid))
            .sort((a, b) => getTotalCpu(b) - getTotalCpu(a));
    });
}
function flatten(proc) {
    proc.prefix = proc.children.length ? "─┬" : "─";
    const ret = [proc];
    proc.children.forEach((child, c) => {
        const flatChildren = flatten(child);
        flatChildren.forEach((other, o) => {
            if (o == 0)
                other.prefix =
                    (c == proc.children.length - 1 ? " └" : " ├") + other.prefix;
            else
                other.prefix =
                    (c == proc.children.length - 1 ? "  " : " │") + other.prefix;
        });
        ret.push(...flatChildren);
    });
    return ret;
}
function flattenTree(procs) {
    const root = {
        pid: 0,
        name: "",
        ppid: 0,
        argv: [],
        children: procs,
    };
    const ret = flatten(root);
    return ret.slice(1);
}
function table(procs) {
    const header = ["pid", "cpu", "mem", "project", "cmd"].map((h) => chalk_1.default.red(h));
    let items = [
        header,
        ...procs.map((proc) => {
            var _a, _b;
            return [
                proc.pid === -1 ? "" : `${chalk_1.default.magenta(proc.pid)}`,
                proc.cpu === undefined
                    ? ""
                    : (((_a = proc.cpu) !== null && _a !== void 0 ? _a : 0) > 10 ? chalk_1.default.red : chalk_1.default.green)(`${proc.cpu}%`.padEnd(5)),
                proc.memory === undefined
                    ? ""
                    : (((_b = proc.memory) !== null && _b !== void 0 ? _b : 0) > 10 ? chalk_1.default.red : chalk_1.default.green)(`${proc.memory}%`),
                chalk_1.default.blue(proc.project ? proc.project : ""),
                proc.prefix || "",
                shellwords_ts_1.join(proc.argv),
            ];
        }),
    ];
    const widths = new Array();
    items.forEach((item) => item.forEach((value, col) => (widths[col] = Math.max(widths[col] || 0, stringWidth(value)))));
    const cmdWidth = process.stdout.columns -
        widths
            .slice(0, -1)
            .map((v) => v + 1)
            .reduce((p, c) => p + c) -
        8;
    items = items.map((item, row) => {
        for (let col = 0; col <= 3; col++)
            item[col] += " ".repeat(widths[col] - stringWidth(item[col]));
        if (row !== 0) {
            item[4] = item[4].padEnd(widths[4], "─");
            if (item[5].length > cmdWidth - 1)
                item[5] = `${item[5].slice(0, cmdWidth - 2)}…`;
            const argv = item[5].split(" ");
            item[4] = `${item[4]} ${chalk_1.default.yellow(argv[0])} ${argv.slice(1).join(" ")}`;
        }
        return item.slice(0, 5);
    });
    widths[4] += cmdWidth;
    return items
        .map((item, row) => {
        let ret = item.join(chalk_1.default.grey(" │ "));
        // return `${stringWidth(ret)}`
        // console.log(stringWidth(ret))
        if (row === 0)
            ret += `\n${chalk_1.default.gray(widths
                .slice(0, -1)
                .map((w) => "─".repeat(w))
                .join("─┼─"))}`;
        return ret;
    })
        .join("\n");
}
function updater() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const list = flattenTree(yield getProcessTree());
        let text = table(list);
        text = text.split("\n").slice(0, process.stdout.rows).join("\n");
        // terminal.clearScreen()
        readline_1.default.cursorTo(process.stdout, 0, 0);
        readline_1.default.clearScreenDown(process.stdout);
        process.stdout.write(text);
    });
}
function nodeTop(ms = 2000) {
    ms = Math.max(ms, 1000);
    terminal_1.hideCursor();
    process.stdout.on("resize", () => {
        void updater();
    });
    void updater();
    const interval = setInterval(() => {
        void updater();
    }, ms);
    process_1.onProcessExit(() => clearInterval(interval));
    readline_1.default.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);
    process.stdin.on("keypress", (_event, key) => {
        if (key.name === "q" || (key.ctrl && key.name == "c")) {
            clearInterval(interval);
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(0);
        }
    });
}
exports.nodeTop = nodeTop;
//# sourceMappingURL=monitor.js.map