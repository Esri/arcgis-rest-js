"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = exports.build = void 0;
const logger_1 = require("../logger");
const process_1 = require("../build/process");
async function build(commandOptions) {
    const buildState = await process_1.createBuildState(commandOptions);
    // Start by cleaning the directory
    process_1.maybeCleanBuildDirectory(buildState);
    await process_1.addBuildFilesFromMountpoints(buildState);
    await process_1.buildFiles(buildState);
    await process_1.buildDependencies(buildState);
    await process_1.writeToDisk(buildState);
    // "--watch" mode - Start watching the file system.
    if (buildState.isWatch) {
        return process_1.startWatch(buildState);
    }
    await process_1.optimize(buildState);
    await process_1.postBuildCleanup(buildState);
    return {
        onFileChange: () => {
            throw new Error('build().onFileChange() only supported in "watch" mode.');
        },
        shutdown: () => {
            throw new Error('build().shutdown() only supported in "watch" mode.');
        },
    };
}
exports.build = build;
async function command(commandOptions) {
    try {
        commandOptions.config.devOptions.output =
            commandOptions.config.devOptions.output ||
                (commandOptions.config.buildOptions.watch ? 'dashboard' : 'stream');
        await build(commandOptions);
    }
    catch (err) {
        logger_1.logger.error(err.message);
        logger_1.logger.error(err.stack);
        process.exit(1);
    }
    if (commandOptions.config.buildOptions.watch) {
        // We intentionally never want to exit in watch mode!
        return new Promise(() => { });
    }
}
exports.command = command;
