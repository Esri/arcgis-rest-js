"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.copySync = exports.copy = exports.writeFile = exports.writeFileSync = exports.readFile = exports.normalizePath = exports.getCommonDirectory = void 0;
const fs = require("fs");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Get the longest directory path common to all files.
 */
function getCommonDirectory(files) {
    if (!files.length) {
        return "";
    }
    const roots = files.map((f) => f.split(/\\|\//));
    if (roots.length === 1) {
        return roots[0].slice(0, -1).join("/");
    }
    let i = 0;
    while (new Set(roots.map((part) => part[i])).size === 1) {
        i++;
    }
    return roots[0].slice(0, i).join("/");
}
exports.getCommonDirectory = getCommonDirectory;
/**
 * Normalize the given path.
 *
 * @param path  The path that should be normalized.
 * @returns The normalized path.
 */
function normalizePath(path) {
    return path.replace(/\\/g, "/");
}
exports.normalizePath = normalizePath;
/**
 * Load the given file and return its contents.
 *
 * @param file  The path of the file to read.
 * @returns The files contents.
 */
function readFile(file) {
    const buffer = fs.readFileSync(file);
    switch (buffer[0]) {
        case 0xfe:
            if (buffer[1] === 0xff) {
                let i = 0;
                while (i + 1 < buffer.length) {
                    const temp = buffer[i];
                    buffer[i] = buffer[i + 1];
                    buffer[i + 1] = temp;
                    i += 2;
                }
                return buffer.toString("ucs2", 2);
            }
            break;
        case 0xff:
            if (buffer[1] === 0xfe) {
                return buffer.toString("ucs2", 2);
            }
            break;
        case 0xef:
            if (buffer[1] === 0xbb) {
                return buffer.toString("utf8", 3);
            }
    }
    return buffer.toString("utf8", 0);
}
exports.readFile = readFile;
/**
 * Write a file to disc.
 *
 * If the containing directory does not exist it will be created.
 *
 * @param fileName  The name of the file that should be written.
 * @param data  The contents of the file.
 */
function writeFileSync(fileName, data) {
    fs.mkdirSync((0, path_1.dirname)(normalizePath(fileName)), { recursive: true });
    fs.writeFileSync(normalizePath(fileName), data);
}
exports.writeFileSync = writeFileSync;
/**
 * Write a file to disc.
 *
 * If the containing directory does not exist it will be created.
 *
 * @param fileName  The name of the file that should be written.
 * @param data  The contents of the file.
 */
async function writeFile(fileName, data) {
    await fs_1.promises.mkdir((0, path_1.dirname)(normalizePath(fileName)), {
        recursive: true,
    });
    await fs_1.promises.writeFile(normalizePath(fileName), data);
}
exports.writeFile = writeFile;
/**
 * Copy a file or directory recursively.
 */
async function copy(src, dest) {
    const stat = await fs_1.promises.stat(src);
    if (stat.isDirectory()) {
        const contained = await fs_1.promises.readdir(src);
        await Promise.all(contained.map((file) => copy((0, path_1.join)(src, file), (0, path_1.join)(dest, file))));
    }
    else if (stat.isFile()) {
        await fs_1.promises.mkdir((0, path_1.dirname)(dest), { recursive: true });
        await fs_1.promises.copyFile(src, dest);
    }
    else {
        // Do nothing for FIFO, special devices.
    }
}
exports.copy = copy;
function copySync(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        const contained = fs.readdirSync(src);
        contained.forEach((file) => copySync((0, path_1.join)(src, file), (0, path_1.join)(dest, file)));
    }
    else if (stat.isFile()) {
        fs.mkdirSync((0, path_1.dirname)(dest), { recursive: true });
        fs.copyFileSync(src, dest);
    }
    else {
        // Do nothing for FIFO, special devices.
    }
}
exports.copySync = copySync;
/**
 * Equivalent to rm -rf
 * @param target
 */
async function remove(target) {
    // Since v14.14
    if (fs_1.promises.rm) {
        await fs_1.promises.rm(target, { recursive: true, force: true });
    }
    else if (fs.existsSync(target)) {
        // Ew. We shouldn't need the exists check... Can't wait for Node 14.
        await fs_1.promises.rmdir(target, { recursive: true });
    }
}
exports.remove = remove;
