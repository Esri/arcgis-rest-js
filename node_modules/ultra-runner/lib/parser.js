"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandParser = exports.Command = exports.CommandType = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path = tslib_1.__importStar(require("path"));
const shellwords_ts_1 = tslib_1.__importDefault(require("shellwords-ts"));
const pnp_1 = require("./pnp");
var CommandType;
(function (CommandType) {
    CommandType["script"] = "script";
    CommandType["bin"] = "bin";
    CommandType["system"] = "system";
    CommandType["op"] = "op";
    CommandType["unknown"] = "unknown";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
class Command {
    constructor(args, type, bin, env = {}) {
        this.args = args;
        this.type = type;
        this.bin = bin;
        this.env = env;
        this.children = [];
        this.concurrent = false;
        // eslint-disable-next-line @typescript-eslint/require-await
        this.beforeRun = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return;
        });
        // eslint-disable-next-line @typescript-eslint/require-await
        this.afterRun = () => {
            return;
        };
        this.name = args[0];
    }
    add(...children) {
        this.children.push(...children);
        return this;
    }
    setCwd(cwd) {
        this.cwd = cwd;
        for (const c of this.children) {
            c.setCwd(cwd);
        }
        return this;
    }
    setPackageName(name) {
        this.packageName = name;
        for (const c of this.children) {
            c.setPackageName(name);
        }
        return this;
    }
    debug(showConcurrent = false) {
        const args = this.args.slice(1).join(" ");
        let cmd = `${this.type}:${this.name}${args.length ? ` ${args}` : ""}`;
        if (showConcurrent && this.concurrent)
            cmd += ":cc";
        const children = [];
        for (const c of this.children) {
            children.push(c.debug(showConcurrent));
        }
        if (children.length) {
            if (this.type == CommandType.unknown)
                return children.length == 1 ? children[0] : children;
            const ret = {};
            ret[cmd] = children.length == 1 ? children[0] : children;
            return ret;
        }
        return cmd;
    }
    isPreScript() {
        return this.type == CommandType.script && this.name.startsWith("pre");
    }
    isPostScript() {
        return this.type == CommandType.script && this.name.startsWith("post");
    }
}
exports.Command = Command;
class CommandParser {
    constructor(pkg, cwd = process.cwd()) {
        this.pkg = pkg;
        this.ops = [";", "||", "&&"];
        this.hooks = [
            [["yarn"], [CommandType.script, CommandType.bin]],
            [
                ["yarn", "run"],
                [CommandType.script, CommandType.bin],
            ],
            [["npm", "run"], [CommandType.script]],
            [["npx"], [CommandType.bin]],
            [["pnpx"], [CommandType.bin]],
            [["pnpm", "run"], [CommandType.script]],
        ];
        this.binPath = [];
        this.binsPnp = new Map();
        while (cwd != "/") {
            const p = path.resolve(cwd, "./node_modules/.bin");
            if (fs_1.existsSync(p))
                this.binPath.push(p);
            if (fs_1.existsSync(path.resolve(cwd, ".pnp.js")) ||
                fs_1.existsSync(path.resolve(cwd, ".pnp.cjs"))) {
                this.binsPnp = pnp_1.getBinaries(cwd, pkg.name);
            }
            const up = path.resolve(cwd, "../");
            if (up == cwd)
                break;
            cwd = up;
        }
    }
    parseArgs(cmd) {
        const args = [];
        shellwords_ts_1.default.split(cmd, (rawPart) => {
            rawPart = rawPart.trim();
            // Fix incorrect handling of ops
            for (const op of this.ops) {
                if (rawPart !== op && rawPart.endsWith(op)) {
                    args.push(rawPart.slice(0, -op.length), op);
                    return;
                }
            }
            args.push(rawPart);
        });
        return args;
    }
    createScript(name, args = [], env = {}) {
        var _a, _b, _c;
        const script = this.getScript(name);
        if (args[0] == "--")
            args.shift();
        const ret = this.createGroup(`${script} ${args.join(" ")}`, false);
        ret.name = name;
        ret.type = CommandType.script;
        if (this.getScript(`pre${name}`))
            ret.children.unshift(this.createScript(`pre${name}`, [], env));
        if (this.getScript(`post${name}`))
            ret.children.push(this.createScript(`post${name}`, [], env));
        ret.concurrent = (_c = (_b = (_a = this.pkg.ultra) === null || _a === void 0 ? void 0 : _a.concurrent) === null || _b === void 0 ? void 0 : _b.includes(name)) !== null && _c !== void 0 ? _c : false;
        return ret;
    }
    createCommand(cmd, allowScriptCmd, env) {
        hook: for (const [prefix, types] of this.hooks) {
            for (const [i, p] of prefix.entries()) {
                if (p != cmd[i])
                    continue hook;
            }
            const c = cmd[prefix.length];
            if (this.isScript(c) && types.includes(CommandType.script)) {
                return this.createScript(c, cmd.slice(prefix.length + 1), env);
            }
            if (types.includes(CommandType.bin) && this.isBin(c)) {
                return new Command(cmd.slice(prefix.length), CommandType.bin, this.getBin(c), env);
            }
        }
        if (allowScriptCmd && this.isScript(cmd[0]))
            return this.createScript(cmd[0], cmd.slice(1), env);
        if (this.isBin(cmd[0]))
            return new Command(cmd, CommandType.bin, this.getBin(cmd[0]), env);
        return new Command(cmd, CommandType.system, undefined, env);
    }
    parseEnvVar(arg) {
        var _a;
        return (_a = /^([a-z_0-9-]+)=(.+)$/iu.exec(arg)) === null || _a === void 0 ? void 0 : _a.slice(1, 3);
    }
    isEnvVar(arg) {
        return this.parseEnvVar(arg) !== undefined;
    }
    createGroup(cmd, allowScriptCmd = true) {
        const args = this.parseArgs(cmd);
        const group = new Command([], CommandType.unknown);
        let cmdArgs = [];
        const env = {};
        let canBeEnvVar = true;
        for (const a of args) {
            const envVar = this.parseEnvVar(a);
            if (canBeEnvVar && envVar) {
                env[envVar[0]] = envVar[1];
                continue;
            }
            else
                canBeEnvVar = false;
            if (this.ops.includes(a)) {
                if (cmdArgs.length)
                    group.children.push(this.createCommand(cmdArgs, allowScriptCmd, env));
                cmdArgs = [];
                group.children.push(new Command([a], CommandType.op));
            }
            else
                cmdArgs.push(a);
        }
        if (cmdArgs.length)
            group.children.push(this.createCommand(cmdArgs, allowScriptCmd, env));
        return group;
    }
    parse(cmd) {
        return this.createGroup(cmd);
    }
    isScript(name) {
        return this.pkg.scripts && name in this.pkg.scripts;
    }
    getBin(name) {
        for (const dir of this.binPath) {
            const bin = path.resolve(dir, name);
            if (fs_1.existsSync(bin))
                return bin;
        }
        // Special syntax for pnp binaries. Handles by spawn.ts
        if (this.binsPnp.has(name)) {
            return `yarn:${this.binsPnp.get(name)}`;
        }
    }
    isBin(name) {
        return this.getBin(name) ? true : false;
    }
    getScript(name) {
        var _a;
        return (_a = this.pkg.scripts) === null || _a === void 0 ? void 0 : _a[name];
    }
}
exports.CommandParser = CommandParser;
//# sourceMappingURL=parser.js.map