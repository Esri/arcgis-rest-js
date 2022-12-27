"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsBuild = exports.ChangeType = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const git_1 = require("./git");
const options_1 = require("./options");
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["added"] = 0] = "added";
    ChangeType[ChangeType["deleted"] = 1] = "deleted";
    ChangeType[ChangeType["modified"] = 2] = "modified";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
function getChanges(existingDeps, newDeps) {
    // Files
    const files = new Map(Object.entries(existingDeps.files || {}));
    const changes = new Array();
    Object.entries(newDeps.files || {}).forEach(([file, hash]) => {
        if (files.has(file)) {
            if (files.get(file) == hash) {
                files.delete(file);
            }
            else {
                changes.push({ file, type: ChangeType.modified });
                files.delete(file);
            }
        }
        else {
            changes.push({ file, type: ChangeType.added });
        }
    });
    changes.push(...[...files.keys()].map((file) => ({ file, type: ChangeType.deleted })));
    // Dependencies
    Object.entries(newDeps.deps).forEach(([dep, mtime]) => {
        if (!existingDeps.deps[dep])
            changes.push({ file: dep, type: ChangeType.added });
        else if (mtime === 0 || mtime !== existingDeps.deps[dep])
            changes.push({ file: dep, type: ChangeType.modified });
    });
    return changes;
}
function getDependencies(root, workspace) {
    const deps = {};
    const pkgName = workspace === null || workspace === void 0 ? void 0 : workspace.getPackageForRoot(root);
    if (pkgName)
        workspace === null || workspace === void 0 ? void 0 : workspace.getDeps(pkgName).forEach((d) => {
            const pkg = workspace.packages.get(d);
            if (pkg && pkg.root) {
                const p = path_1.default.resolve(pkg.root, options_1.HASH_FILE);
                deps[d] = fs_1.default.existsSync(p) ? fs_1.default.lstatSync(p).mtimeMs : 0;
            }
        });
    return deps;
}
function getPackageFiles(root, workspace) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return {
            files: yield git_1.cache.getFiles(root),
            deps: getDependencies(root, workspace),
        };
    });
}
function loadPackageFiles(depsFile) {
    let ret = { files: {}, deps: {} };
    if (fs_1.default.existsSync(depsFile)) {
        ret = JSON.parse(fs_1.default.readFileSync(depsFile).toString());
        if (!ret.files)
            ret.files = {};
        if (!ret.deps)
            ret.deps = {};
    }
    return ret;
}
function needsBuild(root, workspace, forceRebuild = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const depsFile = path_1.default.resolve(root, options_1.HASH_FILE);
        const existingDeps = forceRebuild
            ? { files: {}, deps: {} }
            : loadPackageFiles(depsFile);
        let deps = { files: {}, deps: {} };
        let isGitRepo = true;
        try {
            deps = yield getPackageFiles(root, workspace);
        }
        catch (error) {
            if (error instanceof git_1.NoGitError) {
                isGitRepo = false;
            }
            else
                throw error;
        }
        const changes = getChanges(existingDeps, deps);
        const doBuild = changes.length ||
            !isGitRepo ||
            forceRebuild ||
            Object.keys(deps.files).length == 0;
        if (doBuild) {
            return {
                isGitRepo,
                changes,
                // eslint-disable-next-line @typescript-eslint/require-await
                onBuild: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (!isGitRepo)
                        return;
                    git_1.cache.clear();
                    fs_1.default.writeFileSync(depsFile, JSON.stringify(yield getPackageFiles(root, workspace)));
                }),
            };
        }
    });
}
exports.needsBuild = needsBuild;
//# sourceMappingURL=build.js.map