require("isomorphic-form-data");
global.fetch = require('node-fetch');

require("ts-node").register({
  compilerOptions: {
    module: "commonjs"
  }
});
