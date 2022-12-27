import * as esbuild from 'esbuild';
import * as colors from 'kleur/colors';
import path from 'path';
import { promises as fs } from 'fs';
import { logger } from '../logger';
const IS_PREACT = /from\s+['"]preact['"]/;
function checkIsPreact(contents) {
    return IS_PREACT.test(contents);
}
function getLoader(filePath) {
    const ext = path.extname(filePath);
    const loader = ext === '.mjs' ? 'js' : ext.substr(1);
    const isJSX = loader.endsWith('x');
    return { loader, isJSX };
}
export function esbuildPlugin(config, { input }) {
    return {
        name: '@snowpack/plugin-esbuild',
        resolve: {
            input,
            output: ['.js'],
        },
        async load({ filePath }) {
            var _a, _b;
            let contents = await fs.readFile(filePath, 'utf8');
            const { loader, isJSX } = getLoader(filePath);
            if (isJSX) {
                const jsxInject = config.buildOptions.jsxInject ? `${config.buildOptions.jsxInject}\n` : '';
                contents = jsxInject + contents;
            }
            const isPreact = isJSX && checkIsPreact(contents);
            let jsxFactory = (_a = config.buildOptions.jsxFactory) !== null && _a !== void 0 ? _a : (isPreact ? 'h' : undefined);
            let jsxFragment = (_b = config.buildOptions.jsxFragment) !== null && _b !== void 0 ? _b : (isPreact ? 'Fragment' : undefined);
            const { code, map, warnings } = await esbuild.transform(contents, {
                loader: loader,
                jsxFactory,
                jsxFragment,
                sourcefile: filePath,
                sourcemap: config.buildOptions.sourcemap && 'inline',
                charset: 'utf8',
                sourcesContent: config.mode !== 'production',
            });
            for (const warning of warnings) {
                logger.error(`${colors.bold('!')} ${filePath}
  ${warning.text}`);
            }
            return {
                '.js': {
                    code: code || '',
                    map,
                },
            };
        },
        cleanup() { },
    };
}
