"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = exports.findUp = exports.findPackages = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const BASIC_IGNORE = ["**/node_modules/**", "**/bower_components/**"];
const DEFAULT_IGNORE = ["**/test/**", "**/tests/**", "**/__tests__/**"];
function findPackages(patterns, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fastGlob = (yield Promise.resolve().then(() => tslib_1.__importStar(require("fast-glob")))).default;
        if (!options)
            options = {};
        if (!options.ignore)
            options.ignore = DEFAULT_IGNORE;
        options.ignore.push(...BASIC_IGNORE);
        if (options.includeRoot)
            patterns.push(".");
        patterns = patterns.map((pattern) => pattern.replace(/\/?$/u, "/package.json"));
        return (yield fastGlob(patterns, options)).map((file) => path_1.default.resolve((options === null || options === void 0 ? void 0 : options.cwd) || process.cwd(), path_1.default.dirname(file)));
    });
}
exports.findPackages = findPackages;
function findUp(name, cwd = process.cwd()) {
    let up = path_1.default.resolve(cwd);
    do {
        cwd = up;
        const p = path_1.default.resolve(cwd, name);
        if (fs_1.default.existsSync(p))
            return cwd;
        up = path_1.default.resolve(cwd, "../");
    } while (up !== cwd);
}
exports.findUp = findUp;
function getPackage(root) {
    const pkgPath = path_1.default.resolve(root, "package.json");
    if (fs_1.default.existsSync(pkgPath)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pkg = require(pkgPath);
        if (!pkg.name)
            pkg.name = root;
        pkg.root = root;
        return pkg;
    }
}
exports.getPackage = getPackage;
//# sourceMappingURL=package.js.map