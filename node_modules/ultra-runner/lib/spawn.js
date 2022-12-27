"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spawner = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const process_1 = require("./process");
const cross_spawn_1 = require("cross-spawn");
const npm_run_path_1 = tslib_1.__importDefault(require("npm-run-path"));
class Spawner {
    constructor(cmd, args = [], cwd = process.cwd(), env) {
        this.cmd = cmd;
        this.args = args;
        this.cwd = cwd;
        this.env = env;
        this.output = "";
        this.buffer = "";
        this.exitCode = undefined;
        this.onData = (data) => {
            data;
        };
        this.onLine = (line) => {
            line;
        };
        this.onError = (error) => {
            return error;
        };
        this.onExit = (code) => {
            return new Error(`Exit code ${code}`);
        };
    }
    spawn(raw = false) {
        const env = Object.assign(Object.assign(Object.assign({}, npm_run_path_1.default.env({ cwd: this.cwd })), { FORCE_COLOR: `${chalk_1.default.level}` }), this.env);
        const child = cross_spawn_1.spawn(this.cmd, this.args, {
            env,
            stdio: raw ? "inherit" : "pipe",
            cwd: this.cwd,
        });
        if (!Spawner.children.size)
            process_1.onProcessExit((reason) => Spawner.exit(reason));
        Spawner.children.set(child.pid, child);
        const processData = (data) => {
            data = `${data}`;
            this.output += data;
            let chunk = `${data}`;
            let nl;
            while ((nl = chunk.indexOf("\n")) >= 0) {
                const line = this.buffer + chunk.slice(0, nl);
                this.buffer = "";
                chunk = chunk.slice(nl + 1);
                this.onLine(line);
            }
            this.buffer = chunk;
            this.onData(data);
        };
        return new Promise((resolve, reject) => {
            var _a, _b;
            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on("data", processData);
            (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on("data", processData);
            child.on("error", (err) => {
                Spawner.children.delete(child.pid);
                reject(this.onError(err));
            });
            child.on("close", (code) => {
                this.exitCode = code || 0;
                if (this.buffer.length)
                    this.onLine(`${this.buffer}\n`);
                this.buffer = "";
                Spawner.children.delete(child.pid);
                if (code)
                    reject(this.onExit(code));
                else
                    resolve();
            });
        });
    }
    static exit(_reason) {
        Spawner.children.forEach((child) => {
            // console.log(`[${reason}] Killing ${child.pid}`)
            child.kill();
        });
    }
}
exports.Spawner = Spawner;
Spawner.children = new Map();
//# sourceMappingURL=spawn.js.map