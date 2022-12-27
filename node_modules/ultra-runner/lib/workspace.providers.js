"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = exports.WorkspaceProviderType = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const package_1 = require("./package");
var WorkspaceProviderType;
(function (WorkspaceProviderType) {
    WorkspaceProviderType["single"] = "single";
    WorkspaceProviderType["lerna"] = "lerna";
    WorkspaceProviderType["yarn"] = "yarn";
    WorkspaceProviderType["pnpm"] = "pnpm";
    WorkspaceProviderType["rush"] = "rush";
    WorkspaceProviderType["recursive"] = "recursive";
})(WorkspaceProviderType = exports.WorkspaceProviderType || (exports.WorkspaceProviderType = {}));
exports.providers = {
    yarn: (cwd) => {
        let root = package_1.findUp("package.json", cwd);
        while (root) {
            const pkg = package_1.getPackage(root);
            if (pkg === null || pkg === void 0 ? void 0 : pkg.workspaces) {
                if (Array.isArray(pkg.workspaces))
                    return { root, patterns: pkg.workspaces };
                if (Array.isArray(pkg.workspaces.packages))
                    return { root, patterns: pkg.workspaces.packages };
            }
            root = package_1.findUp("package.json", path_1.default.resolve(path_1.default.dirname(root), ".."));
        }
    },
    pnpm: (cwd) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const yaml = yield Promise.resolve().then(() => tslib_1.__importStar(require("yamljs")));
        const root = package_1.findUp("pnpm-workspace.yaml", cwd);
        if (root) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const y = yaml.parse(fs_1.default.readFileSync(path_1.default.resolve(root, "pnpm-workspace.yaml"), "utf8"));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            if (y.packages)
                return { root, patterns: y.packages };
        }
    }),
    lerna: (cwd) => {
        const root = package_1.findUp("lerna.json", cwd);
        if (root)
            return {
                root,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
                patterns: require(path_1.default.resolve(root, "lerna.json"))
                    .packages,
            };
    },
    rush: (cwd) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const json5 = (yield Promise.resolve().then(() => tslib_1.__importStar(require("json5")))).default;
        const root = package_1.findUp("rush.json", cwd);
        if (root) {
            return {
                root,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                patterns: (_a = json5
                    .parse(fs_1.default.readFileSync(path_1.default.resolve(root, "rush.json")).toString())) === null || _a === void 0 ? void 0 : _a.projects.map((p) => p.projectFolder),
            };
        }
    }),
    recursive: (cwd) => {
        return { root: cwd, patterns: ["*/**"] };
    },
    single: (cwd) => {
        const root = package_1.findUp("package.json", cwd);
        if (root)
            return { root, patterns: [root] };
    },
};
//# sourceMappingURL=workspace.providers.js.map