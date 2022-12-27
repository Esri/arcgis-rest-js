"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showHelp = void 0;
const tslib_1 = require("tslib");
/* eslint-disable unicorn/no-process-exit */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const options_1 = require("./options");
const path_1 = tslib_1.__importDefault(require("path"));
const styles = [
    {
        style: chalk_1.default.blue.underline,
        strings: [
            "Status:",
            "Build:",
            "Formatting:",
            "Workspace:",
            "Options:",
            "Usage:",
        ],
    },
    { style: chalk_1.default.cyan, strings: ["boolean"] },
    { style: chalk_1.default.yellow, strings: ["number"] },
    { style: chalk_1.default.magenta, strings: ["string"] },
];
const program = yargs_1.default
    .wrap(Math.min(120, yargs_1.default.terminalWidth()))
    .locale("en")
    .usage(`${chalk_1.default.green("Usage:")} $0 ${chalk_1.default.gray.dim("[options]")} ${chalk_1.default.gray.bold("<cmd>")} ${chalk_1.default.gray.dim("[cmd-options]")}`)
    .alias("h", "help")
    .help(false)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    .version(require(path_1.default.resolve(__dirname, "../package.json")).version)
    .group(["recursive", "filter", "root", "concurrency", "serial", "topology"], "Workspace:")
    .group(["info", "list", "monitor", "monitor-interval"], "Status:")
    .group(["build", "rebuild"], "Build:")
    .group(["pretty", "raw", "silent", "color"], "Formatting:");
Object.entries(options_1.RunnerOptionDefs).forEach(([name, def]) => {
    program.option(name, Object.assign(Object.assign({}, def), { requiresArg: def.type !== "boolean" }));
});
const ret = {};
styles.forEach((style) => style.strings.forEach((str) => (ret[str] = style.style(str))));
program.updateStrings(ret);
function showHelp(exitCode = 1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    program.showHelp((str) => process.stdout.write(`${str.replace(/--[a-zA-Z-]+| -[a-z]/gu, (str) => {
        return chalk_1.default.gray.bold(str);
    })}\n\n`));
    console.log("See --list for available scripts");
    process.exit(exitCode);
}
exports.showHelp = showHelp;
//# sourceMappingURL=yargs.js.map