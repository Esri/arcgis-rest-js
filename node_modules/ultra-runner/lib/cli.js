"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const tslib_1 = require("tslib");
/* eslint-disable unicorn/no-process-exit */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const options_1 = require("./options");
const runner_1 = require("./runner");
function showHelp(exitCode) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        ;
        (yield Promise.resolve().then(() => tslib_1.__importStar(require("./yargs")))).showHelp(exitCode);
    });
}
function run(argv = process.argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const options = options_1.parse(argv);
        const args = options["--"];
        if (argv.includes("--build") && !args.length)
            args.push("build");
        if (argv.includes("--rebuild") && !args.length)
            args.push("build");
        if (options.serial)
            options.concurrency = 1;
        if (options.help)
            return yield showHelp(1);
        if (options.monitor) {
            return (yield Promise.resolve().then(() => tslib_1.__importStar(require("./monitor")))).nodeTop(options.monitorInterval * 1000);
        }
        if (args[0]) {
            if (args[0] == "build" || args[0].startsWith("build "))
                options.build = true;
            if (args[0] == "rebuild" || args[0].startsWith("rebuild ")) {
                args[0] = args[0].slice(2);
                options.rebuild = true;
            }
        }
        if (options.rebuild)
            options.build = true;
        if (options.debug)
            console.log({ options, args });
        const runner = new runner_1.Runner(options);
        try {
            if (options.list)
                return yield runner.list();
            if (options.info)
                return yield runner.info();
            if (args.length) {
                yield (options.recursive
                    ? runner.runRecursive(args.join(" "))
                    : runner.run(args.join(" ")));
            }
            else
                yield showHelp(1);
        }
        catch (error) {
            runner.spinner._stop();
            if (error instanceof Error) {
                console.error(chalk_1.default.red("error ") + error.message);
            }
            else
                console.error(chalk_1.default.red("error ") + error);
            if (options.debug)
                console.log(error);
            process.exit(1);
        }
    });
}
exports.run = run;
/* c8 ignore next 3 */
if (module === require.main) {
    void run();
}
//# sourceMappingURL=cli.js.map