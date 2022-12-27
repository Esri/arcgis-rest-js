import { install } from 'esinstall';
import url from 'url';
import util from 'util';
import { buildFile } from '../build/build-pipeline';
import { logger } from '../logger';
export async function installPackages({ config, isDev, isSSR, installOptions, installTargets, }) {
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
    const finalResult = await install(installTargets, {
        cwd: config.root,
        alias: config.alias,
        logger: {
            debug: (...args) => logger.debug(util.format(...args), { name: loggerName }),
            log: (...args) => logger.info(util.format(...args), { name: loggerName }),
            warn: (...args) => logger.warn(util.format(...args), { name: loggerName }),
            error: (...args) => logger.error(util.format(...args), { name: loggerName }),
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
                        const output = await buildFile(url.pathToFileURL(id), {
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
    logger.debug('Successfully ran esinstall.');
    return { importMap: finalResult.importMap, needsSsrBuild };
}
