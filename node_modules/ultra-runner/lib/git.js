"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.getGitFiles = exports.parseFiles = exports.NoGitError = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const ignore_1 = tslib_1.__importDefault(require("ignore"));
const package_1 = require("./package");
const options_1 = require("./options");
const regex = /^([A-Z?])\s+(\d{6})\s+([a-z0-9]{40})\s+(\d+)\s+(.*)$/u;
class NoGitError extends Error {
}
exports.NoGitError = NoGitError;
function getUltraIgnore(root) {
    const ultraIgnorePath = path_1.default.resolve(root, ".ultraignore");
    if (fs_1.default.existsSync(ultraIgnorePath)) {
        const ultraIgnore = ignore_1.default();
        ultraIgnore.add(fs_1.default.readFileSync(ultraIgnorePath).toString());
        return ultraIgnore;
    }
}
function parseFiles(data, root) {
    const ret = {};
    data.split("\n").forEach((line) => {
        const m = regex.exec(line);
        if (m) {
            const file = m[5];
            let hash = m[3];
            if (m[1] == "C") {
                const filePath = path_1.default.resolve(root, file);
                hash += fs_1.default.existsSync(filePath)
                    ? `.${fs_1.default.lstatSync(filePath).mtimeMs}`
                    : ".del";
            }
            ret[file] = hash;
        }
        else {
            const file = line.slice(2);
            const filePath = path_1.default.resolve(root, file);
            if (fs_1.default.existsSync(filePath))
                ret[file] = `${fs_1.default.lstatSync(filePath).mtimeMs}`;
        }
    });
    return ret;
}
exports.parseFiles = parseFiles;
function getGitFiles(root) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            child_process_1.exec("git ls-files --full-name -s -d -c -m -o --directory -t", { cwd: root, maxBuffer: 1024 * 1024 * 1024 }, (error, stdout) => {
                if (error)
                    return reject(error);
                return resolve(parseFiles(stdout, root));
            });
        });
    });
}
exports.getGitFiles = getGitFiles;
class FilesCache {
    constructor() {
        this.cache = new Map();
    }
    clear() {
        this.cache.clear();
    }
    getFiles(directory, exclude = []) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const root = package_1.findUp(".git", directory);
            if (!root)
                throw new NoGitError(`Not a Git repository ${directory}`);
            if (!this.cache.has(root)) {
                this.cache.set(root, yield getGitFiles(root));
            }
            const files = this.cache.get(root) || {};
            const ret = {};
            const ultraIgnore = getUltraIgnore(root);
            Object.entries(files)
                .filter(([file]) => {
                const filePath = path_1.default.resolve(root, file);
                if (file && ultraIgnore && ultraIgnore.ignores(file))
                    return false;
                return (filePath == directory || filePath.startsWith(directory + path_1.default.sep));
            })
                .map(([file, hash]) => [
                path_1.default.relative(directory, path_1.default.resolve(root, file)),
                hash,
            ])
                .filter(([file]) => file.length && !exclude.includes(file) && !file.endsWith(options_1.HASH_FILE))
                .forEach(([file, hash]) => (ret[file] = hash));
            return ret;
        });
    }
}
exports.cache = new FilesCache();
//# sourceMappingURL=git.js.map