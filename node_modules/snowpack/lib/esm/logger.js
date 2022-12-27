import * as colors from 'kleur/colors';
const levels = {
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    silent: 90,
};
/** Custom logger heavily-inspired by https://github.com/pinojs/pino with extra features like log retentian */
class SnowpackLogger {
    constructor() {
        /** set the log level (can be changed after init) */
        this.level = 'info';
        /** configure maximum number of logs to keep (default: 500) */
        this.logCount = 500;
        this.history = []; // this is immutable; must be accessed with Logger.getHistory()
        this.callbacks = {
            debug: (message) => {
                console.log(message);
            },
            info: (message) => {
                console.log(message);
            },
            warn: (message) => {
                console.warn(message);
            },
            error: (message) => {
                console.error(message);
            },
        };
    }
    log({ level, name, message, task, }) {
        // test if this level is enabled or not
        if (levels[this.level] > levels[level]) {
            return; // do nothing
        }
        // format
        let text = message;
        if (level === 'warn')
            text = colors.yellow(text);
        if (level === 'error')
            text = colors.red(text);
        const time = new Date();
        const log = `${colors.dim(`[${String(time.getHours() + 1).padStart(2, '0')}:${String(time.getMinutes() + 1).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}]`)} ${colors.dim(`[${name}]`)} ${text}`;
        // add to log history and remove old logs to keep memory low
        const lastHistoryItem = this.history[this.history.length - 1];
        if (lastHistoryItem && lastHistoryItem.val === log) {
            lastHistoryItem.count++;
        }
        else {
            this.history.push({ val: log, count: 1 });
        }
        while (this.history.length > this.logCount) {
            this.history.shift();
        }
        // log
        if (typeof this.callbacks[level] === 'function') {
            this.callbacks[level](log);
        }
        else {
            throw new Error(`No logging method defined for ${level}`);
        }
        // logger takes a possibly processor-intensive task, and only
        // processes it when this log level is enabled
        task && task(this);
    }
    /** emit messages only visible when --debug is passed */
    debug(message, options) {
        const name = (options && options.name) || 'snowpack';
        this.log({ level: 'debug', name, message, task: options === null || options === void 0 ? void 0 : options.task });
    }
    /** emit general info */
    info(message, options) {
        const name = (options && options.name) || 'snowpack';
        this.log({ level: 'info', name, message, task: options === null || options === void 0 ? void 0 : options.task });
    }
    /** emit non-fatal warnings */
    warn(message, options) {
        const name = (options && options.name) || 'snowpack';
        this.log({ level: 'warn', name, message, task: options === null || options === void 0 ? void 0 : options.task });
    }
    /** emit critical error messages */
    error(message, options) {
        const name = (options && options.name) || 'snowpack';
        this.log({ level: 'error', name, message, task: options === null || options === void 0 ? void 0 : options.task });
    }
    /** get full logging history */
    getHistory() {
        return this.history;
    }
    /** listen for events */
    on(event, callback) {
        this.callbacks[event] = callback;
    }
}
/** export one logger to rest of app */
export const logger = new SnowpackLogger();
