"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPackages = void 0;
const esinstall_1 = require("esinstall");
const url_1 = __importDefault(require("url"));
const util_1 = __importDefault(require("util"));
const build_pipeline_1 = require("../build/build-pipeline");
const logger_1 = require("../logger");
async function installPackages({ config, isDev, isSSR, installOptions, installTargets, }) {
    var _a, _b;
    if (installTargets.length === 0) {
        return {
            importMap: { imports: {} },
            needsSsrBuild: false,
        };
    }
    const loggerName = installTargets.length === 1
        ? `esinstall:${typeof installTargets[0] === 'string' ? installTargets[0] : installTargets[0].specifier}`
        : `esinstall`;
    let needsSsrBuild = false;
    const finalResult = await esinstall_1.install(installTargets, {
        cwd: config.root,
        alias: config.alias,
        logger: {
            debug: (...args) => logger_1.logger.debug(util_1.default.format(...args), { name: loggerName }),
            log: (...args) => logger_1.logger.info(util_1.default.format(...args), { name: loggerName }),
            warn: (...args) => logger_1.logger.warn(util_1.default.format(...args), { name: loggerName }),
            error: (...args) => logger_1.logger.error(util_1.default.format(...args), { name: loggerName }),
        },
        // Important! Lots of options come in through here,
        // `external` is a very important one to NOT override.
        ...installOptions,
        stats: false,
        rollup: {
            plugins: [
                ...((_b = (_a = installOptions === null || installOptions === void 0 ? void 0 : installOptions.rollup) === null || _a === void 0 ? void 0 : _a.plugins) !== null && _b !== void 0 ? _b : []),
                {
                    name: 'esinstall:snowpack',
                    async load(id) {
                        // SSR Packages: Some file types build differently for SSR vs. non-SSR.
                        // This line checks for those file types. Svelte is the only known file
                        // type for now, but you can add to this line if you encounter another.
                        needsSsrBuild = needsSsrBuild || id.endsWith('.svelte');
                        const output = await build_pipeline_1.buildFile(url_1.default.pathToFileURL(id), {
                            config,
                            isDev,
                            isSSR,
                            isPackage: true,
                            isHmrEnabled: false,
                        });
                        let jsResponse;
                        for (const [outputType, outputContents] of Object.entries(output)) {
                            if (outputContents && outputType === '.js') {
                                jsResponse = outputContents;
                            }
                        }
                        if (jsResponse && Buffer.isBuffer(jsResponse.code)) {
                            jsResponse.code = jsResponse.code.toString();
                        }
                        return jsResponse;
                    },
                },
            ],
        },
    });
    logger_1.logger.debug('Successfully ran esinstall.');
    return { importMap: finalResult.importMap, needsSsrBuild };
}
exports.installPackages = installPackages;
