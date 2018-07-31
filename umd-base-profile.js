import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";

const path = require("path");
const fs = require("fs");
const _ = require("lodash");

/**
 * Since Rollup runs inside each package we can just get the current
 * package we are bundling.
 */
const pkg = require(path.join(process.cwd(), "package.json"));

/**
 * and dig out its name.
 */
const { name } = pkg;

/**
 * to construct a copyright banner
 */

const copyright = `/* @preserve
* ${pkg.name} - v${pkg.version} - ${pkg.license}
* Copyright (c) 2017-${new Date().getFullYear()} Esri, Inc.
* ${new Date().toString()}
*/`;


/**
 * The module name will be the name of the global variable used in UMD builds.
 * All exported members of each package will be attached to this global.
 */
const moduleName = "arcgisRest";

/**
 * Now we need to discover all the `@esri/arcgis-rest-*` package names so we can create
 * the `globals` and `externals` to pass to Rollup.
 */
const packageNames = fs
  .readdirSync(path.join(__dirname, "packages"))
  .filter(p => p[0] !== ".")
  .map(p => {
    return require(path.join(__dirname, "packages", p, "package.json")).name;
  }, {});

/**
 * Rollup will use this map to determine where to lookup modules on the global
 * window object when neither AMD or CommonJS is being used. This configuration
 * will cause Rollup to lookup all imports from our packages on a single global
 * `arcgisRest` object.
 */
const globals = packageNames.reduce((globals, p) => {
  globals[p] = moduleName;
  return globals;
}, {});

/**
 * Now we can export the Rollup config!
 */
export default {
  input: "./src/index.ts",
  output: {
    file: `./dist/umd/${name.replace("@esri/arcgis-rest-", "")}.umd.js`,
    sourcemap: true,
    banner: copyright,
    format: "umd",
    name: moduleName,
    globals,
    extend: true // causes this module to extend the global specified by `moduleName`
  },
  context: "window",
  external: packageNames,
  plugins: [
    typescript(),
    json(),
    resolve(),
    commonjs()
  ]
};
