import config from './rollup.config.plugins';

export default Object.assign(config, {
  entry: 'src/index.ts',
  targets: [
    { dest: './dist/umd/bundle.umd.js', format: 'umd', sourceMap: true },
  ],
  context: 'window',
  globals: {
    'form-data': 'FormData',
    'url-search-params': 'URLSearchParams'
  },
  moduleName: 'arcgis'
});
