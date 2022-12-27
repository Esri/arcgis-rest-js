"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaries = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const micro_memoize_1 = tslib_1.__importDefault(require("micro-memoize"));
const path_1 = tslib_1.__importStar(require("path"));
const v8_1 = tslib_1.__importDefault(require("v8"));
const zlib_1 = tslib_1.__importDefault(require("zlib"));
const getInstallState = micro_memoize_1.default((workspaceRoot) => {
    const serializedState = fs_1.readFileSync(path_1.resolve(workspaceRoot, ".yarn", "install-state.gz"));
    const installState = v8_1.default.deserialize(zlib_1.default.gunzipSync(serializedState));
    return installState;
});
function getBinaries(workspaceRoot, packageName) {
    var _a, _b;
    const binaries = new Map();
    const installState = getInstallState(workspaceRoot);
    const hashes = new Set();
    const api = getPnpApi(workspaceRoot);
    const packageLocator = api
        .getDependencyTreeRoots()
        .find((x) => x.name === packageName);
    if (!packageLocator) {
        throw new Error(`Cannot find package locator for ${packageName}`);
    }
    const packageLocation = (_a = api.getPackageInformation(packageLocator)) === null || _a === void 0 ? void 0 : _a.packageLocation;
    if (!packageLocation) {
        throw new Error(`Cannot find package location for ${packageName}`);
    }
    for (const p of installState.storedPackages.values()) {
        const pkgName = p.scope ? `@${p.scope}/${p.name}` : p.name;
        if (packageName == pkgName) {
            hashes.add(p.locatorHash);
            (_b = p.dependencies) === null || _b === void 0 ? void 0 : _b.forEach((dep) => {
                const h = installState.storedResolutions.get(dep.descriptorHash);
                if (h)
                    hashes.add(h);
            });
        }
    }
    for (const h of hashes) {
        const p = installState.storedPackages.get(h);
        if (p === null || p === void 0 ? void 0 : p.bin.size) {
            ;
            [...p.bin.keys()].forEach((b) => {
                try {
                    const pkgName = p.scope ? `@${p.scope}/${p.name}` : p.name;
                    const binPath = api.resolveRequest(
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    path_1.default.join(pkgName, p.bin.get(b)), path_1.default.resolve(packageLocation, "package.json"));
                    if (binPath) {
                        binaries.set(b, binPath);
                    }
                    // eslint-disable-next-line no-empty
                }
                catch (_a) { }
            });
        }
    }
    return binaries;
}
exports.getBinaries = getBinaries;
const getPnpApi = micro_memoize_1.default(function getPnpApi(workspaceRoot) {
    const jsPath = path_1.default.resolve(workspaceRoot, ".pnp.js");
    const cjsPath = path_1.default.resolve(workspaceRoot, ".pnp.cjs");
    return (fs_1.existsSync(jsPath) ? require(jsPath) : require(cjsPath));
});
//# sourceMappingURL=pnp.js.map