"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspace = exports.Workspace = void 0;
const tslib_1 = require("tslib");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const globrex_1 = tslib_1.__importDefault(require("globrex"));
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const package_1 = require("./package");
const workspace_providers_1 = require("./workspace.providers");
const defaultOptions = {
    cwd: process.cwd(),
    type: undefined,
    includeRoot: false,
};
class Workspace {
    constructor(root, packages, type) {
        this.root = root;
        this.type = type;
        this.packages = new Map();
        this.roots = new Map();
        packages.forEach((p) => {
            if (!p.name)
                p.name = p.root;
            this.packages.set(p.name, p);
            this.roots.set(p.root, p.name);
        });
        this.order = [];
        [...this.packages.entries()].forEach(([name]) => {
            if (!this.order.includes(name)) {
                ;
                [...this.getDepTree(name), name].forEach((n) => this.order.includes(n) || this.order.push(n));
            }
        });
    }
    getPackageManager() {
        const pms = {
            npm: ["package-lock.json", "npm-shrinkwrap.json"],
            yarn: ["yarn.lock"],
            pnpm: ["pnpm-lock.yaml"],
        };
        for (const [type, files] of Object.entries(pms)) {
            if (files.some((f) => fs_1.existsSync(path_1.default.resolve(this.root, f))))
                return type;
        }
    }
    static detectWorkspaceProviders(cwd = process.cwd()) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ret = [];
            const types = Object.entries(workspace_providers_1.providers);
            for (const [type, provider] of types) {
                if (["single", "recursive"].includes(type))
                    continue;
                if ((_a = (yield provider(cwd))) === null || _a === void 0 ? void 0 : _a.patterns.length) {
                    ret.push(type);
                }
            }
            return ret;
        });
    }
    static getWorkspace(_options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const options = Object.assign(Object.assign({}, defaultOptions), _options);
            const types = options.type
                ? [options.type]
                : Object.keys(workspace_providers_1.providers);
            for (const type of types) {
                const provider = workspace_providers_1.providers[type];
                const info = yield provider(options.cwd);
                if (info) {
                    if (options.includeRoot)
                        info.patterns.push(".");
                    const packages = (yield package_1.findPackages(info.patterns, {
                        cwd: info.root,
                        ignore: type == workspace_providers_1.WorkspaceProviderType.recursive ? undefined : [],
                    })).map((p) => package_1.getPackage(p));
                    return new Workspace(info.root, packages, type);
                }
            }
        });
    }
    getPackageForRoot(root) {
        return this.roots.get(root);
    }
    getDeps(pkgName) {
        var _a, _b;
        return Object.keys(Object.assign(Object.assign({}, (_a = this.packages.get(pkgName)) === null || _a === void 0 ? void 0 : _a.dependencies), (_b = this.packages.get(pkgName)) === null || _b === void 0 ? void 0 : _b.devDependencies)).filter((dep) => this.packages.has(dep) && dep !== pkgName);
    }
    _getDepTree(pkgName, seen = []) {
        if (seen.includes(pkgName))
            return [];
        seen.push(pkgName);
        const ret = [];
        this.getDeps(pkgName).forEach((d) => {
            ;
            [...this._getDepTree(d, seen), d].forEach((dd) => ret.includes(dd) || ret.push(dd));
        });
        return ret;
    }
    getDepTree(pkgName) {
        const ret = this._getDepTree(pkgName);
        const idx = ret.indexOf(pkgName);
        if (idx >= 0)
            ret.splice(idx, 1);
        return ret;
    }
    getPackages(filter) {
        let ret = [...this.packages.values()];
        if (filter) {
            const withDeps = filter.startsWith("+");
            let useCwd = false;
            if (withDeps) {
                if (filter === "+" || filter === "+.") {
                    if (!fs_1.existsSync(path_1.default.resolve(".", "package.json"))) {
                        throw new Error(`'--filter +' requires a ./package.json file in the current working directory`);
                    }
                    useCwd = true;
                }
                else {
                    filter = filter.slice(1);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const regex = globrex_1.default(filter, { filepath: true, extended: true })
                .regex;
            const names = new Set();
            ret.forEach((p) => {
                if ((useCwd && p.root == process.cwd()) ||
                    regex.test(p.name || "") ||
                    regex.test(path_1.default.relative(this.root, p.root).replace(/\\/gu, "/"))) {
                    names.add(p.name);
                    if (withDeps)
                        this.getDepTree(p.name).forEach((dep) => names.add(dep));
                }
            });
            ret = ret.filter((p) => names.has(p.name));
        }
        return ret.sort((a, b) => this.order.indexOf(a.name) - this.order.indexOf(b.name));
    }
}
exports.Workspace = Workspace;
function getWorkspace(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return Workspace.getWorkspace(options);
    });
}
exports.getWorkspace = getWorkspace;
//# sourceMappingURL=workspace.js.map