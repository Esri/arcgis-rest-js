"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = require("path");
const parser_1 = require("./parser");
function createCommand(workspace, cmd, options) {
    const useTopology = options.build || options.topology;
    const topoPromises = new Map();
    const topoPackages = new Set();
    const command = new parser_1.Command([], parser_1.CommandType.script);
    let hasScript = false;
    command.children = workspace
        .getPackages(options.filter)
        .map((pkg) => {
        const command = new parser_1.CommandParser(pkg, pkg.root)
            .parse(cmd)
            .setCwd(pkg.root)
            .setPackageName(pkg.name);
        command.name = `${chalk_1.default.cyanBright(pkg.name)} at ${chalk_1.default.grey(path_1.relative(workspace.root, pkg.root))}`;
        command.type = parser_1.CommandType.script;
        if (useTopology) {
            topoPackages.add(pkg.name);
            command.beforeRun = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                topoPromises.set(pkg.name, new Promise((resolve) => {
                    command.afterRun = () => {
                        resolve();
                    };
                }));
                yield Promise.all(workspace
                    .getDepTree(pkg.name)
                    .filter((dep) => topoPackages.has(dep))
                    .map((dep) => topoPromises.get(dep))
                    .filter((p) => p));
            });
        }
        hasScript =
            hasScript || command.children.some((c) => c.type == parser_1.CommandType.script);
        return command;
    })
        // If we have some scripts, filter out the packages that don't have that script
        .filter((c) => !hasScript || c.children.some((c) => c.type == parser_1.CommandType.script));
    command.concurrent = true;
    return command;
}
exports.createCommand = createCommand;
//# sourceMappingURL=concurrency.js.map