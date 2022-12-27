import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import tsc from 'typescript';

import pkg from './package.json';

const UMD_CONFIG = {
  input: 'src/index.ts',
  output: {
    exports: 'default',
    file: pkg.browser,
    format: 'umd',
    name: pkg.name,
    sourcemap: true,
  },
  plugins: [
    typescript({ typescript: tsc }),
  ],
};

const FORMATTED_CONFIG = Object.assign({}, UMD_CONFIG, {
  output: [
    Object.assign({}, UMD_CONFIG.output, {
      file: pkg.main,
      format: 'cjs',
    }),
    Object.assign({}, UMD_CONFIG.output, {
      file: pkg.module,
      format: 'es',
    }),
  ],
});

const MINIFIED_CONFIG = Object.assign({}, UMD_CONFIG, {
  output: Object.assign({}, UMD_CONFIG.output, {
    file: pkg.browser.replace('.js', '.min.js'),
    sourcemap: false,
  }),
  plugins: UMD_CONFIG.plugins.concat([uglify()]),
});

export default [UMD_CONFIG, FORMATTED_CONFIG, MINIFIED_CONFIG];
