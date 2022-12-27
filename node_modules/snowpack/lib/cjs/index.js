"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = exports.loadAndValidateConfig = exports.buildProject = exports.startDevServer = exports.preparePackages = exports.getUrlForFile = exports.logger = exports.clearCache = exports.loadLockfile = exports.createConfiguration = exports.loadConfiguration = exports.build = exports.NotFoundError = exports.startServer = void 0;
const colors = __importStar(require("kleur/colors"));
const util_1 = __importDefault(require("util"));
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const add_rm_1 = require("./commands/add-rm");
const init_1 = require("./commands/init");
const prepare_1 = require("./commands/prepare");
const build_1 = require("./commands/build");
const dev_1 = require("./commands/dev");
const util_2 = require("./sources/util");
const logger_1 = require("./logger");
const config_1 = require("./config");
const util_js_1 = require("./util.js");
const file_urls_1 = require("./build/file-urls");
__exportStar(require("./types"), exports);
// Stable API
var dev_2 = require("./commands/dev");
Object.defineProperty(exports, "startServer", { enumerable: true, get: function () { return dev_2.startServer; } });
Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function () { return dev_2.NotFoundError; } });
var build_2 = require("./commands/build");
Object.defineProperty(exports, "build", { enumerable: true, get: function () { return build_2.build; } });
var config_js_1 = require("./config.js");
Object.defineProperty(exports, "loadConfiguration", { enumerable: true, get: function () { return config_js_1.loadConfiguration; } });
Object.defineProperty(exports, "createConfiguration", { enumerable: true, get: function () { return config_js_1.createConfiguration; } });
var util_js_2 = require("./util.js");
Object.defineProperty(exports, "loadLockfile", { enumerable: true, get: function () { return util_js_2.readLockfile; } });
var util_3 = require("./sources/util");
Object.defineProperty(exports, "clearCache", { enumerable: true, get: function () { return util_3.clearCache; } });
var logger_2 = require("./logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_2.logger; } });
// Helper API
function getUrlForFile(fileLoc, config) {
    const result = file_urls_1.getUrlsForFile(fileLoc, config);
    return result ? result[0] : result;
}
exports.getUrlForFile = getUrlForFile;
function preparePackages({ config }) {
    const pkgSource = util_2.getPackageSource(config);
    return pkgSource.prepare();
}
exports.preparePackages = preparePackages;
// Deprecated API
function startDevServer() {
    throw new Error('startDevServer() was been renamed to startServer().');
}
exports.startDevServer = startDevServer;
function buildProject() {
    throw new Error('buildProject() was been renamed to build().');
}
exports.buildProject = buildProject;
function loadAndValidateConfig() {
    throw new Error('loadAndValidateConfig() has been deprecated in favor of loadConfiguration() and createConfiguration().');
}
exports.loadAndValidateConfig = loadAndValidateConfig;
function printHelp() {
    logger_1.logger.info(`
${colors.bold(`snowpack`)} - A faster build system for the modern web.

  Snowpack is best configured via config file.
  But, most configuration can also be passed via CLI flags.
  📖 ${colors.dim('https://www.snowpack.dev/reference/configuration')}

${colors.bold('Commands:')}
  snowpack init          Create a new project config file.
  snowpack prepare       Prepare your project for development (optional).
  snowpack dev           Develop your project locally.
  snowpack build         Build your project for production.
  snowpack add [package] Add a package to your project.
  snowpack rm [package]  Remove a package from your project.

${colors.bold('Flags:')}
  --config [path]        Set the location of your project config file.
  --help                 Show this help message.
  --version              Show the current version.
  --reload               Clear the local cache (useful for troubleshooting).
  --cache-dir-path       Specify a custom cache directory.
  --verbose              Enable verbose log messages.
  --quiet                Enable minimal log messages.
    `.trim());
}
async function cli(args) {
    // parse CLI flags
    const cliFlags = yargs_parser_1.default(args, {
        array: ['install', 'env', 'exclude', 'external'],
    });
    if (cliFlags.verbose) {
        logger_1.logger.level = 'debug';
    }
    if (cliFlags.quiet) {
        logger_1.logger.level = 'silent';
    }
    if (cliFlags.help) {
        printHelp();
        process.exit(0);
    }
    if (cliFlags.version) {
        logger_1.logger.info(require('../../package.json').version);
        process.exit(0);
    }
    if (cliFlags.reload) {
        logger_1.logger.info(colors.yellow('! clearing cache...'));
        await util_2.clearCache();
    }
    const cmd = cliFlags['_'][2];
    logger_1.logger.debug(`run command: ${cmd}`);
    if (!cmd) {
        printHelp();
        process.exit(1);
    }
    // Set this early -- before config loading -- so that plugins see it.
    if (cmd === 'build') {
        process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    }
    if (cmd === 'dev') {
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    }
    const cliConfig = config_1.expandCliFlags(cliFlags);
    const config = await config_1.loadConfiguration(cliConfig, cliFlags.config);
    logger_1.logger.debug(`config loaded: ${util_1.default.format(config)}`);
    const lockfile = await util_js_1.readLockfile(config.root);
    logger_1.logger.debug(`lockfile ${lockfile ? 'loaded.' : 'not loaded'}`);
    const commandOptions = {
        config,
        lockfile,
    };
    if (cmd === 'add') {
        await add_rm_1.addCommand(cliFlags['_'][3], commandOptions);
        return process.exit(0);
    }
    if (cmd === 'rm') {
        await add_rm_1.rmCommand(cliFlags['_'][3], commandOptions);
        return process.exit(0);
    }
    if (cliFlags['_'].length > 3) {
        logger_1.logger.error(`Unexpected multiple commands`);
        process.exit(1);
    }
    if (cmd === 'prepare') {
        await prepare_1.command(commandOptions);
        return process.exit(0);
    }
    if (cmd === 'init') {
        await init_1.command(commandOptions);
        return process.exit(0);
    }
    if (cmd === 'build') {
        await build_1.command(commandOptions);
        return process.exit(0);
    }
    if (cmd === 'dev') {
        await dev_1.command(commandOptions);
        return process.exit(0);
    }
    logger_1.logger.error(`Unrecognized command: ${cmd}`);
    process.exit(1);
}
exports.cli = cli;
