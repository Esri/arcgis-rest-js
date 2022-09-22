/* eslint-env node */
require("cross-fetch/polyfill");
require("isomorphic-form-data");
require("crypto");
require("dotenv").config();
require("ts-node").register({
  compilerOptions: {
    module: "commonjs",
    target: "es2017"
  }
});
