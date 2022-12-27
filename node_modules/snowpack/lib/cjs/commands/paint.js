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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDashboard = exports.getPort = exports.paintEvent = void 0;
const cli_spinners_1 = __importDefault(require("cli-spinners"));
const detect_port_1 = __importDefault(require("detect-port"));
const colors = __importStar(require("kleur/colors"));
const readline_1 = __importDefault(require("readline"));
const util_1 = __importDefault(require("util"));
const logger_1 = require("../logger");
exports.paintEvent = {
    BUILD_FILE: 'BUILD_FILE',
    LOAD_ERROR: 'LOAD_ERROR',
    SERVER_START: 'SERVER_START',
    WORKER_COMPLETE: 'WORKER_COMPLETE',
    WORKER_MSG: 'WORKER_MSG',
    WORKER_RESET: 'WORKER_RESET',
};
/**
 * Get the actual port, based on the `defaultPort`.
 * If the default port was not available, then we'll prompt the user if its okay
 * to use the next available port.
 */
async function getPort(defaultPort) {
    const bestAvailablePort = await detect_port_1.default(defaultPort);
    if (defaultPort !== bestAvailablePort) {
        let useNextPort = false;
        if (process.stdout.isTTY) {
            const rl = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
            useNextPort = await new Promise((resolve) => {
                rl.question(colors.yellow(`! Port ${colors.bold(defaultPort)} not available. Run on port ${colors.bold(bestAvailablePort)} instead? (Y/n) `), (answer) => {
                    resolve(!/^no?$/i.test(answer));
                });
            });
            rl.close();
        }
        if (!useNextPort) {
            logger_1.logger.error(`✘ Port ${colors.bold(defaultPort)} not available. Use ${colors.bold('--port')} to specify a different port.`);
            process.exit(1);
        }
    }
    return bestAvailablePort;
}
exports.getPort = getPort;
function startDashboard(bus, _config) {
    let spinnerFrame = 0;
    // "dashboard": Pipe console methods to the logger, and then start the dashboard.
    logger_1.logger.debug(`attaching console.log listeners`);
    console.log = (...args) => {
        logger_1.logger.info(util_1.default.format(...args));
    };
    console.warn = (...args) => {
        logger_1.logger.warn(util_1.default.format(...args));
    };
    console.error = (...args) => {
        logger_1.logger.error(util_1.default.format(...args));
    };
    function paintDashboard() {
        let dashboardMsg = colors.cyan(`${cli_spinners_1.default.dots.frames[spinnerFrame]} watching for file changes...`);
        const lines = dashboardMsg.split('\n').length;
        return { msg: dashboardMsg, lines };
    }
    function clearDashboard(num, msg) {
        // Clear Info Line
        while (num > 0) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.moveCursor(0, -1);
            num--;
        }
        if (!msg || cleanTimestamp(msg) !== lastMsg) {
            process.stdout.moveCursor(0, 1);
        }
    }
    let lastMsg = '\0';
    let lastMsgCount = 1;
    function addTimestamp(msg) {
        let counter = '';
        if (cleanTimestamp(msg) === lastMsg) {
            lastMsgCount++;
            counter = colors.yellow(` (x${lastMsgCount})`);
        }
        else {
            lastMsgCount = 1;
        }
        return msg + counter;
    }
    function cleanTimestamp(msg) {
        return msg.replace(/^.*\]/, '');
    }
    bus.on(exports.paintEvent.WORKER_MSG, ({ id, msg }) => {
        const cleanedMsg = msg.trim();
        if (!cleanedMsg) {
            return;
        }
        for (const individualMsg of cleanedMsg.split('\n')) {
            logger_1.logger.info(individualMsg, { name: id });
        }
    });
    let currentDashboardHeight = 1;
    function onLog(msg) {
        clearDashboard(currentDashboardHeight, msg);
        process.stdout.write(addTimestamp(msg));
        lastMsg = cleanTimestamp(msg);
        process.stdout.write('\n');
        const result = paintDashboard();
        process.stdout.write(result.msg);
        currentDashboardHeight = result.lines;
    }
    logger_1.logger.on('debug', onLog);
    logger_1.logger.on('info', onLog);
    logger_1.logger.on('warn', onLog);
    logger_1.logger.on('error', onLog);
    setInterval(() => {
        spinnerFrame = (spinnerFrame + 1) % cli_spinners_1.default.dots.frames.length;
        clearDashboard(currentDashboardHeight);
        const result = paintDashboard();
        process.stdout.write(result.msg);
        currentDashboardHeight = result.lines;
    }, 1000);
    logger_1.logger.debug(`dashboard started`);
}
exports.startDashboard = startDashboard;
