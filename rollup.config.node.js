
import config from './rollup.config.plugins';

export default Object.assign(config, {
  entry: 'src/index.ts',
  targets: [
    { dest: './dist/node/bundle.cjs.js', format: 'cjs', sourceMap: true }
  ],
});
