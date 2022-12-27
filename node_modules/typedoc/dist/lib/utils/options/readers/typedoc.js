"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDocReader = void 0;
const path_1 = require("path");
const FS = require("fs");
const assert_1 = require("assert");
/**
 * Obtains option values from typedoc.json
 * or typedoc.js (discouraged since ~0.14, don't fully deprecate until API has stabilized)
 */
class TypeDocReader {
    constructor() {
        /**
         * Should run before the tsconfig reader so that it can specify a tsconfig file to read.
         */
        this.priority = 100;
        this.name = "typedoc-json";
    }
    /**
     * Read user configuration from a typedoc.json or typedoc.js configuration file.
     * @param container
     * @param logger
     */
    read(container, logger) {
        const path = container.getValue("options");
        const file = this.findTypedocFile(path);
        if (!file) {
            if (container.isSet("options")) {
                logger.error(`The options file could not be found with the given path ${path}`);
            }
            return;
        }
        const seen = new Set();
        this.readFile(file, container, logger, seen);
    }
    /**
     * Read the given options file + any extended files.
     * @param file
     * @param container
     * @param logger
     */
    readFile(file, container, logger, seen) {
        if (seen.has(file)) {
            logger.error(`Tried to load the options file ${file} multiple times.`);
            return;
        }
        seen.add(file);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fileContent = require(file);
        if (typeof fileContent !== "object" || !fileContent) {
            logger.error(`The file ${file} is not an object.`);
            return;
        }
        // clone option object to avoid of property changes in re-calling this file
        const data = { ...fileContent };
        delete data["$schema"]; // Useful for better autocompletion, should not be read as a key.
        if ("extends" in data) {
            const extended = getStringArray(data["extends"]);
            for (const extendedFile of extended) {
                // Extends is relative to the file it appears in.
                this.readFile((0, path_1.resolve)((0, path_1.dirname)(file), extendedFile), container, logger, seen);
            }
            delete data["extends"];
        }
        for (const [key, val] of Object.entries(data)) {
            try {
                container.setValue(key, val, (0, path_1.resolve)((0, path_1.dirname)(file)));
            }
            catch (error) {
                (0, assert_1.ok)(error instanceof Error);
                logger.error(error.message);
            }
        }
    }
    /**
     * Search for the typedoc.js or typedoc.json file from the given path
     *
     * @param  path Path to the typedoc.(js|json) file. If path is a directory
     *   typedoc file will be attempted to be found at the root of this path
     * @param logger
     * @return the typedoc.(js|json) file path or undefined
     */
    findTypedocFile(path) {
        path = (0, path_1.resolve)(path);
        return [
            path,
            (0, path_1.join)(path, "typedoc.json"),
            (0, path_1.join)(path, "typedoc.js"),
        ].find((path) => FS.existsSync(path) && FS.statSync(path).isFile());
    }
}
exports.TypeDocReader = TypeDocReader;
function getStringArray(arg) {
    return Array.isArray(arg) ? arg.map(String) : [String(arg)];
}
