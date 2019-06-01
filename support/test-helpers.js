// ensures node-fetch is available as a global
require('cross-fetch/polyfill');
require("isomorphic-form-data");

require("ts-node").register({
  compilerOptions: {
    module: "commonjs"
  }
});
