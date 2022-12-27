"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const fs_1 = require("fs");
const colors_1 = require("kleur/colors");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../logger");
const util_1 = require("../util");
async function command(commandOptions) {
    const { config } = commandOptions;
    logger_1.logger.info(`Creating new project configuration file... ${colors_1.dim('(snowpack.config.js)')}`);
    if (!fs_1.existsSync(path_1.default.join(config.root, 'package.json'))) {
        logger_1.logger.error(`Error: create a package.json file in your project root`);
        process.exit(1);
    }
    const destLoc = path_1.default.join(config.root, 'snowpack.config.js');
    if (fs_1.existsSync(destLoc)) {
        logger_1.logger.error(`Error: File already exists, cannot overwrite ${destLoc}`);
        process.exit(1);
    }
    await fs_1.promises.writeFile(destLoc, util_1.INIT_TEMPLATE_FILE);
    logger_1.logger.info(`File created! Open ${colors_1.bold('snowpack.config.js')} to customize your project.`);
}
exports.command = command;
