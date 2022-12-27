"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = require("fs");
const path_1 = tslib_1.__importStar(require("path"));
const perf_hooks_1 = require("perf_hooks");
const shellwords_ts_1 = tslib_1.__importDefault(require("shellwords-ts"));
const build_1 = require("./build");
const formatter_1 = require("./formatter");
const options_1 = require("./options");
const package_1 = require("./package");
const parser_1 = require("./parser");
const spawn_1 = require("./spawn");
const spinner_1 = require("./spinner");
const workspace_1 = require("./workspace");
const workspace_providers_1 = require("./workspace.providers");
const concurrency_1 = require("./concurrency");
class Runner {
    constructor(_options = {}) {
        this._options = _options;
        this.spinner = new spinner_1.OutputSpinner();
        this.buildCmd = "build";
        this.deps = new Map();
        this.options = Object.assign(Object.assign({}, options_1.defaults), _options);
    }
    formatStart(cmd, level, parentSpinner) {
        if (this.options.raw)
            return;
        const title = this.formatCommand(cmd);
        if (!this.options.pretty) {
            const prefix = cmd.packageName
                ? `${chalk_1.default.grey.dim(` (${cmd.packageName})`)}`
                : "";
            if (cmd.type == parser_1.CommandType.script)
                console.log(`❯ ${title}${prefix}`);
            else
                console.log(title + prefix);
        }
        else
            return this.spinner.start(title, level, parentSpinner);
    }
    // TODO: refactor the method below. Move to its own class
    runCommand(cmd, level = -2, parentSpinner) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (cmd.type == parser_1.CommandType.op)
                return;
            const isBuildScript = cmd.type == parser_1.CommandType.script && cmd.name == this.buildCmd;
            const changes = isBuildScript
                ? yield build_1.needsBuild(cmd.cwd || process.cwd(), this.workspace, this.options.rebuild)
                : undefined;
            yield cmd.beforeRun();
            let spinner;
            if (cmd.type == parser_1.CommandType.script) {
                if (level >= 0)
                    spinner = this.formatStart(cmd, level, parentSpinner);
            }
            else {
                if (cmd.args.length) {
                    const args = shellwords_ts_1.default.split(cmd.args.join(" "));
                    if (cmd.bin)
                        args[0] = cmd.bin;
                    const cmdSpinner = this.formatStart(cmd, level, parentSpinner);
                    try {
                        if (!this.options.dryRun) {
                            const formatter = new formatter_1.CommandFormatter(args[0], level, cmdSpinner, this.options, cmd.packageName);
                            yield this.spawn(args[0], args.slice(1), formatter, cmd.cwd, cmd.env);
                        }
                        if (cmdSpinner) {
                            if (/warning/iu.test(cmdSpinner.output))
                                this.spinner.warning(cmdSpinner);
                            else
                                this.spinner.success(cmdSpinner);
                        }
                    }
                    catch (error) {
                        if (cmdSpinner)
                            this.spinner.error(cmdSpinner);
                        throw error;
                    }
                }
            }
            const formatter = new formatter_1.CommandFormatter(cmd.name, level, spinner, this.options, cmd.packageName);
            if (isBuildScript) {
                if (!changes)
                    formatter.write("No changes. Skipping build...");
                else if (!changes.isGitRepo) {
                    formatter.write(`${chalk_1.default.red("warning ")}Not a Git repository, so build change detection is disabled. Forcing full rebuild.`);
                }
                else {
                    formatter.write(chalk_1.default.blue("changes:\n") +
                        changes.changes
                            .map((c) => {
                            let str = "  ";
                            if (c.type == build_1.ChangeType.added)
                                str += chalk_1.default.green("+");
                            else if (c.type == build_1.ChangeType.deleted)
                                str += chalk_1.default.red("-");
                            else if (c.type == build_1.ChangeType.modified)
                                str += chalk_1.default.green("+");
                            return `${str} ${c.file}`;
                        })
                            .join("\n"));
                    // formatter.write(chalk.red("\nWaiting for\n"))
                }
            }
            try {
                if (!isBuildScript || changes) {
                    const promises = [];
                    for (const child of cmd.children) {
                        if (child.isPostScript())
                            yield Promise.all(promises);
                        const promise = this.runCommand(child, level + 1, spinner);
                        promises.push(promise);
                        if (!cmd.concurrent || child.isPreScript())
                            yield promise;
                        else if (promises.length >= this.options.concurrency) {
                            yield Promise.all(promises);
                            promises.length = 0;
                        }
                    }
                    if (cmd.concurrent)
                        yield Promise.all(promises);
                }
                spinner && this.spinner.success(spinner);
                cmd.afterRun();
                if (changes)
                    yield changes.onBuild();
            }
            catch (error) {
                if (spinner)
                    this.spinner.error(spinner);
                throw error;
            }
        });
    }
    formatCommand(cmd) {
        if (cmd.type == parser_1.CommandType.script)
            return chalk_1.default.white.bold(`${cmd.name}`);
        return `${chalk_1.default.grey(`$ ${cmd.args[0]}`)} ${cmd.args
            .slice(1)
            .map((x) => {
            if (x.startsWith("-"))
                return chalk_1.default.cyan(x);
            if (fs_1.existsSync(x))
                return chalk_1.default.magenta(x);
            if (x.includes("*"))
                return chalk_1.default.yellow(x);
            return x;
        })
            .join(" ")}`;
    }
    findPnpJsFile(cwd = process.cwd()) {
        if (this.pnpFile) {
            return this.pnpFile;
        }
        const dir1 = package_1.findUp(".pnp.js", cwd);
        if (dir1) {
            this.pnpFile = path_1.default.resolve(dir1, ".pnp.js");
        }
        const dir2 = package_1.findUp(".pnp.cjs", cwd);
        if (dir2) {
            this.pnpFile = path_1.default.resolve(dir2, ".pnp.cjs");
        }
        return this.pnpFile;
    }
    spawn(cmd, args, formatter, cwd, env) {
        // Special handling for yarn pnp binaries
        if (cmd.startsWith("yarn:")) {
            cmd = cmd.slice(5);
            const pnpFile = this.findPnpJsFile(cwd);
            if (!pnpFile) {
                throw new Error(`cannot find .pnp.js file`);
            }
            args = ["-r", pnpFile, cmd, ...args];
            // will fail with non js binaries, but yarn PnP already does not support them https://github.com/yarnpkg/berry/issues/882
            cmd = "node";
        }
        const spawner = new spawn_1.Spawner(cmd, args, cwd, env);
        if (this.options.pretty)
            spawner.onData = (line) => formatter.write(line);
        else
            spawner.onLine = (line) => formatter.write(line);
        spawner.onError = (err) => new Error(`${chalk_1.default.red("error")} Command ${chalk_1.default.white.dim(path_1.basename(cmd))} failed with ${chalk_1.default.red(err)}. Is the command on your path?`);
        spawner.onExit = (code) => new Error(`${this.options.silent ? formatter.output : ""}\n${chalk_1.default.red("error")} Command ${chalk_1.default.white.dim(path_1.basename(cmd))} failed with exit code ${chalk_1.default.red(code)}`);
        return spawner.spawn(this.options.raw);
    }
    formatDuration(duration) {
        if (duration < 1)
            return `${(duration * 1000).toFixed(0)}ms`;
        return `${duration.toFixed(3)}s`;
    }
    list() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const workspace = yield workspace_1.getWorkspace({
                includeRoot: this.options.root,
                type: this.options.recursive ? undefined : workspace_providers_1.WorkspaceProviderType.single,
            });
            if (!workspace)
                throw new Error("Cannot find package.json");
            let counter = 0;
            workspace === null || workspace === void 0 ? void 0 : workspace.getPackages(this.options.filter).forEach((p) => {
                console.log(`${chalk_1.default.bgGray.cyanBright(` ${counter++} `)} ${chalk_1.default.green(`${p.name}`)} at ${chalk_1.default.whiteBright(path_1.relative(workspace.root, p.root))}`);
                Object.keys(p.scripts || {})
                    .sort()
                    .forEach((s) => {
                    console.log(`  ❯ ${chalk_1.default.grey(s)}`);
                });
            });
        });
    }
    run(cmd, pkg) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!pkg) {
                const root = package_1.findUp("package.json");
                if (root)
                    pkg = package_1.getPackage(root);
            }
            if (!pkg)
                pkg = { name: "" };
            if (pkg) {
                const parser = new parser_1.CommandParser(pkg);
                return yield this._run(parser.parse(cmd));
            }
            throw new Error(`Could not find package`);
        });
    }
    info() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const types = yield workspace_1.Workspace.detectWorkspaceProviders();
            if (!types.length)
                throw new Error("No workspaces found");
            if (types.length > 1)
                console.log(chalk_1.default.blue("Detected workspaces: ") + chalk_1.default.magenta(types.join(", ")));
            const workspace = yield workspace_1.getWorkspace({ includeRoot: true });
            if (workspace) {
                console.log(`${chalk_1.default.blue("Workspace ") + chalk_1.default.magenta(workspace.type)} with ${chalk_1.default.magenta(workspace.getPackageManager())}`);
                let counter = 0;
                workspace.getPackages(this.options.filter).forEach((p) => {
                    let at = path_1.relative(workspace.root, p.root);
                    if (!at.length)
                        at = ".";
                    console.log(`${chalk_1.default.bgGray.cyanBright(` ${counter++} `)} ${chalk_1.default.green(`${p.name}`)} at ${chalk_1.default.whiteBright(at)}`);
                    workspace.getDeps(p.name).forEach((s) => {
                        console.log(`  ❯ ${chalk_1.default.grey(s)}`);
                    });
                });
            }
        });
    }
    runRecursive(cmd) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.workspace = yield workspace_1.getWorkspace({ includeRoot: this.options.root });
            const workspace = this.workspace;
            if (this.options.build)
                this.buildCmd = cmd;
            if (!workspace || !((_a = workspace === null || workspace === void 0 ? void 0 : workspace.packages) === null || _a === void 0 ? void 0 : _a.size))
                throw new Error("Could not find packages in your workspace. Supported: yarn, pnpm, lerna");
            const command = concurrency_1.createCommand(workspace, cmd, this.options);
            return yield this._run(command, -1);
        });
    }
    _run(command, level = -1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.runCommand(command, level);
                this.spinner._stop();
                if (!this.options.silent) {
                    console.log(chalk_1.default.green("success"), "✨", this.options.dryRun ? "Dry-run done" : "Done", `in ${this.formatDuration(perf_hooks_1.performance.nodeTiming.duration / 1000)}`);
                }
            }
            finally {
                this.spinner._stop();
            }
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=runner.js.map