import { Plugin } from 'rollup';
/**
 * rollup-plugin-css
 *
 * Support installing any imported CSS into your dependencies. This isn't strictly valid
 * ESM code, but it is popular in the npm ecosystem & web development ecosystems. It also
 * solves a problem that is difficult to solve otherwise (referencing CSS from JS) so for
 * those reasons we have added default support for importing CSS into Snowpack v2.
 */
export declare function rollupPluginCss(): Plugin;
