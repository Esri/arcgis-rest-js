import postCss from 'postcss';
import postCssModules from 'postcss-modules';
import { logger } from '../logger';
const cssModuleNames = new Map();
/** Generate CSS Modules for a given URL */
export async function cssModules({ contents, url, }) {
    let json = {};
    const processor = postCss([
        postCssModules({
            getJSON: (_, moduleNames) => {
                json = moduleNames;
                cssModuleNames.set(url, JSON.stringify(moduleNames));
            },
        }),
    ]);
    const result = await processor.process(contents, { from: url, to: url });
    // log any warnings that happened.
    result
        .warnings()
        .forEach((element) => logger.warn(`${url} - ${element.text}`, { name: 'snowpack:cssmodules' }));
    return {
        css: result.css,
        json,
    };
}
/** Return CSS Modules JSON from URL */
export function cssModuleJSON(url) {
    return cssModuleNames.get(url) || '{}';
}
/** Should this file get CSS Modules? */
export function needsCSSModules(url) {
    return (url.endsWith('.module.css') || url.endsWith('.module.scss') || url.endsWith('.module.sass'));
}
